using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Net;
using System.Text;
using System.IO;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Threading;
using System.Drawing.Imaging;
using System.Windows.Forms;

public static class BitmapExtensions
{
    public static void SaveJPG100(this Bitmap bmp, string filename)
    {
        var encoderParameters = new EncoderParameters(1);
        encoderParameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 100L);
        bmp.Save(filename, GetEncoder(ImageFormat.Jpeg), encoderParameters);
    }

    public static void SaveJPG100(this Bitmap bmp, Stream stream)
    {
        var encoderParameters = new EncoderParameters(1);
        encoderParameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 100L);
        bmp.Save(stream, GetEncoder(ImageFormat.Jpeg), encoderParameters);
    }

    public static void SavePng(this Bitmap bmp, string filename)
    {
	bmp.Save(filename, System.Drawing.Imaging.ImageFormat.Png);
    }

    public static ImageCodecInfo GetEncoder(ImageFormat format)
    {
        var codecs = ImageCodecInfo.GetImageDecoders();

        foreach (var codec in codecs)
        {
            if (codec.FormatID == format.Guid)
            {
                return codec;
            }
        }

        // Return 
        return null;
    }
}
/// <summary>
/// Summary description for WeiboWebServices
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class WeiboWebServices : System.Web.Services.WebService {

    public WeiboWebServices () {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }
    public static class QuestionHelper
    {
        public static  int Gender = 22;
        public static  int HairLength = 13;
        public static  int HairColor = 15;
        public static  int HairCurly = 14;
        public static  int HairState = 16;
        public static  int Career = 24;
    }
    public class WebsiteToImage
    {
        private Bitmap m_Bitmap;
        private string m_Url;
        private string m_FileName = string.Empty;

        public WebsiteToImage(string url)
        {
            // Without file 
            m_Url = url;
        }

        public WebsiteToImage(string url, string fileName)
        {
            // With file 
            m_Url = url;
            m_FileName = fileName;
        }

        public Bitmap Generate()
        {
            // Thread 
            var m_thread = new Thread(new ThreadStart(_Generate));
            m_thread.SetApartmentState(ApartmentState.STA);
            
            m_thread.Start();
            m_thread.Join();
            return m_Bitmap;
        }

        private void _Generate()
        {
            var browser = new WebBrowser();
	    browser.ScrollBarsEnabled = false;
	    browser.ScriptErrorsSuppressed = true;
            browser.Navigate(m_Url );
	    //browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(WebBrowser_DocumentCompleted);
            while (browser.IsBusy ||
		   browser.ReadyState != WebBrowserReadyState.Complete || 
		   browser.Document == null || 
		   browser.Document.GetElementById("report") == null ||
               	   string.IsNullOrEmpty(browser.Document.GetElementById("report").InnerHtml) )
            {
                System.Windows.Forms.Application.DoEvents();
            }
            System.Threading.Thread.Sleep(5000);
            SaveImage(browser);
            browser.Dispose();
        }

	private void WebBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
	{
	    WebBrowser browser = (WebBrowser)sender;
	    SaveImage(browser);
	}

	private void SaveImage(WebBrowser browser)
	{
            browser.ClientSize = new Size(browser.Document.Body.ScrollRectangle.Width, browser.Document.Body.ScrollRectangle.Bottom);
            m_Bitmap = new Bitmap(browser.Document.Body.ScrollRectangle.Width, browser.Document.Body.ScrollRectangle.Bottom);
            browser.BringToFront();
	    Rectangle rec = browser.Bounds;
	    rec.Width -= 18;
	    rec.Height -= 18;
            browser.DrawToBitmap(m_Bitmap, rec);
            if (m_FileName.Length > 0)
            {
		m_Bitmap.SavePng(m_FileName);
            }
	}
    }

    class SceneUserAnswer
    {
        public int scene_id;
        public List<UserAnswer> user_answers;
    }

    class UserAnswer
    {
        public int question_id;
        public List<int> answer_ids;
    }

    class QuizResponse
    {
        public int quizId;
        public int score;
        public string suggested_products;
        public string hairsituation_suggestions;
        public string haircare_suggestions;
        public string lifestyle_suggestions;
    
    }
    class Avatar {
        public string gender;
        public string hairLength;
        public string career_id;
        public string hairCurly;
        public string hairColor;
        public string hairType;
    }
    class User
    {
        public string qq_uid;
        public string qq_token;
        public string weibo_uid;
        public string weibo_token;
    }
    [WebMethod]
    [ScriptMethod(UseHttpGet = false)]
    public string SubmitAnswer( string user_answers, int quizId, string str_user) {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var sceneUserAnswers = serializer.Deserialize<SceneUserAnswer[]>(user_answers);
        var user = serializer.Deserialize<User>(str_user);
        var userAnswerIds = new List<int>();
        var suggestionIds = new Dictionary<int, List<int>>() { 
            {1, new List<int>()}, 
            {2, new List<int>()},
            {3, new List<int>()}
        };
        var productIds = new List<int>();
        var score = 0.0m;
        foreach (SceneUserAnswer sceneUserAnswer in sceneUserAnswers)
        {
            var answer_ids = sceneUserAnswer.user_answers.Select(i => i.answer_ids).ToList();
            foreach (var answer_id in answer_ids)
            {
                userAnswerIds.AddRange(answer_id);
            }
            
        }

        DataTable answerIdTable = new DataTable("AnswersTableType");
        // Create a DataColumn and set various properties. 
        DataColumn column = new DataColumn();
        column.DataType = System.Type.GetType("System.Int32");
        column.AllowDBNull = false;
        column.ColumnName = "answerId";

        answerIdTable.Columns.Add(column);

        foreach (var userAnswerId in userAnswerIds)
        {
            DataRow answerIdRow = answerIdTable.NewRow();
            answerIdRow["answerId"] = userAnswerId;
            answerIdTable.Rows.Add(answerIdRow);
        }
        
        string connStr = ConfigurationManager.ConnectionStrings["pnt"].ConnectionString;
        using (var conn = new SqlConnection(connStr))
        {
            conn.Open();
            using( var command = new SqlCommand("FetchSuggestions", conn)) {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("Answers", answerIdTable );
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var groupId = reader.GetInt32(reader.GetOrdinal("suggestionGroupId"));
                        suggestionIds[groupId].Add(reader.GetInt32(reader.GetOrdinal("suggestionId")));
                    }

                    if (reader.NextResult())
                    {
                        while (reader.Read())
                        {
                            productIds.Add(reader.GetInt32(reader.GetOrdinal("productId")));
                        }
                    }

                    if (reader.NextResult())
                    {
                        if (reader.Read())
                        {
                            score = reader.GetDecimal(0);
                        }
                    }
                }
            }
            if (quizId == 0)
            {
                using (var command = new SqlCommand("LogUserAnswers", conn))
                {
                    command.CommandType = System.Data.CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("Answers", answerIdTable);
                    if (!string.IsNullOrEmpty(user.qq_uid))
                    {
                        command.Parameters.AddWithValue("QQUID", user.qq_uid);
                    }
                    if(!string.IsNullOrEmpty(user.weibo_uid)) {
                        command.Parameters.AddWithValue("WeiboUID", user.weibo_uid);
                    }
                    quizId = Convert.ToInt32(command.ExecuteScalar());
                }
            }
        }
        return string.Format("{{ \"lifestyle_suggestions\": \"{0}\" , \"haircare_suggestions\" : \"{2}\", \"hairsituation_suggestions\" : \"{3}\",  \"suggested_products\" : \"{1}\", \"score\" : {4}, \"quizId\" : \"{5}\" }}", string.Join(",", suggestionIds[1]), string.Join(",", productIds), string.Join(",", suggestionIds[2]), string.Join(",", suggestionIds[3]), Convert.ToInt32(score/3) , quizId);
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = false)]
    public string GetUserInfo( string client_id , string client_secret, string grant_type, string code, string redirect_uri)
    {
        try
        {
            var json = string.Format("?client_id={0}&client_secret={1}&grant_type={2}&code={3}&redirect_uri={4}", client_id, client_secret, grant_type, code, redirect_uri);
            Uri remoteAddress = new Uri("https://api.weibo.com/oauth2/access_token" + json);
            HttpWebRequest request = WebRequest.Create(remoteAddress) as HttpWebRequest;
            request.ProtocolVersion = HttpVersion.Version11;
            // Create the web request  
            request = WebRequest.Create(remoteAddress) as HttpWebRequest;
            // Set type to POST  
            request.Method = "POST";
            request.ContentType = "text/json";
            request.ContentLength = 0;

            using (HttpWebResponse httpResponse = (HttpWebResponse)request.GetResponse())
            {
                using (StreamReader sr = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = sr.ReadToEnd();
                    return result;
                }
            }
        }
        catch (Exception ex)
        {
            return string.Format("{{ exception: \"{0}\" }}", ex.Message);
        }
    }

    [WebMethod]
    public bool Share(int report_id)
    {
        WebsiteToImage websiteToImage = new WebsiteToImage( ConfigurationManager.AppSettings["BaseUrl"] + "report.html?reportId=" + report_id, string.Format( Server.MapPath("reports")+"\\report_{0}.png", report_id));
        websiteToImage.Generate();
        return true;
    }

    [WebMethod]
    public string FetchReportByUser(string str_user)
    {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var user = serializer.Deserialize<User>(str_user);
        var userAnswers = new List<SceneUserAnswer>();
        var avatar = new Avatar();
        var reportId = 0;
        string connStr = ConfigurationManager.ConnectionStrings["pnt"].ConnectionString;
        using (var conn = new SqlConnection(connStr))
        {
            conn.Open();
            using (var command = new SqlCommand("LOGIN", conn))
            {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                if (!string.IsNullOrEmpty(user.weibo_uid))
                {
                    command.Parameters.AddWithValue("WeiboUID", user.weibo_uid);
                }
                if(!string.IsNullOrEmpty(user.qq_uid)) {
                    command.Parameters.AddWithValue("QQUid", user.qq_uid);
                }
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var sceneId = reader.GetInt32(reader.GetOrdinal("sceneId"));
                        var questionId = reader.GetInt32(reader.GetOrdinal("questionId"));
                        var answerId = reader.GetInt32(reader.GetOrdinal("answerId"));
                        SceneUserAnswer sceneUserAnswer;
                        if (!userAnswers.Exists(i => i.scene_id == sceneId))
                        {
                            sceneUserAnswer = new SceneUserAnswer();
                            sceneUserAnswer.scene_id = sceneId;
                            sceneUserAnswer.user_answers = new List<UserAnswer>();
                            userAnswers.Add(sceneUserAnswer);
                        }
                        else
                        {
                            sceneUserAnswer = userAnswers.Single(i => i.scene_id == sceneId);
                        }
                        UserAnswer userAnswer;
                        if (!sceneUserAnswer.user_answers.Exists(i => i.question_id == questionId))
                        {
                            userAnswer = new UserAnswer();
                            userAnswer.question_id = questionId;
                            userAnswer.answer_ids = new List<int>();
                            sceneUserAnswer.user_answers.Add(userAnswer);
                        }
                        else
                        {
                            userAnswer = sceneUserAnswer.user_answers.First(i => i.question_id == questionId);
                        }
                        userAnswer.answer_ids.Add(answerId);
                    }

                    if (reader.NextResult())
                    {
                        while (reader.Read())
                        {
                            var questionId = reader.GetInt32(reader.GetOrdinal("questionId"));
                            var answerName = reader.GetString(reader.GetOrdinal("answerName"));
                            if (questionId == QuestionHelper.Career)
                            {
                                avatar.career_id = answerName;
                            }
                            else if (questionId == QuestionHelper.Gender)
                            {
                                avatar.gender = answerName;
                            }
                            else if (questionId == QuestionHelper.HairColor)
                            {
                                avatar.hairColor = answerName;
                            }
                            else if (questionId == QuestionHelper.HairState)
                            {
                                avatar.hairType = answerName;
                            }
                            else if (questionId == QuestionHelper.HairLength)
                            {
                                avatar.hairLength = answerName;
                            }
                            else if (questionId == QuestionHelper.HairCurly)
                            {
                                avatar.hairCurly = answerName;
                            }
                        }
                    }
                    if (reader.NextResult())
                    {
                        while (reader.Read())
                        {
                            reportId = reader.GetInt32(reader.GetOrdinal("quizId"));
                        }
                    }
                }
            }

        }

        
        var sceneUserAnswers = serializer.Serialize(userAnswers);
        var str_avatar = serializer.Serialize(avatar);
        var suggestions = "";
        if (reportId != 0)
        {
            suggestions = SubmitAnswer(sceneUserAnswers, reportId, "");
        }
        return string.Format("{{ \"user_answers\" : {0}, \"suggestions\" : {1}, \"avatar\" : {2}, \"report_id\" : {3} }}", sceneUserAnswers, suggestions, str_avatar, reportId);
    }

    [WebMethod]
    public string FetchReport(int report_id)
    {
        var userAnswers = new List<SceneUserAnswer>();
        var avatar = new Avatar();
        string connStr = ConfigurationManager.ConnectionStrings["pnt"].ConnectionString;
        using (var conn = new SqlConnection(connStr))
        {
            conn.Open();
            using (var command = new SqlCommand("FetchAnswersByQuizId", conn))
            {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("QuizId", report_id);
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var sceneId = reader.GetInt32(reader.GetOrdinal("sceneId"));
                        var questionId = reader.GetInt32(reader.GetOrdinal("questionId"));
                        var answerId = reader.GetInt32(reader.GetOrdinal("answerId"));
                        SceneUserAnswer sceneUserAnswer;
                        if (!userAnswers.Exists(i=>i.scene_id == sceneId))
                        {
                            sceneUserAnswer = new SceneUserAnswer();
                            sceneUserAnswer.scene_id = sceneId;
                            sceneUserAnswer.user_answers = new List<UserAnswer>();
                            userAnswers.Add(sceneUserAnswer);
                        }
                        else {
                            sceneUserAnswer = userAnswers.Single(i=>i.scene_id == sceneId);
                        }
                        UserAnswer userAnswer;
                        if(!sceneUserAnswer.user_answers.Exists(i=>i.question_id == questionId)) {
                            userAnswer = new UserAnswer();
                            userAnswer.question_id = questionId;
                            userAnswer.answer_ids = new List<int>();
                            sceneUserAnswer.user_answers.Add(userAnswer);
                        }
                        else {
                            userAnswer = sceneUserAnswer.user_answers.First(i=>i.question_id == questionId);
                        }
                        userAnswer.answer_ids.Add(answerId);
                    }

                    if (reader.NextResult())
                    {
                        while (reader.Read())
                        {
                            var questionId = reader.GetInt32(reader.GetOrdinal("questionId"));
                            var answerName = reader.GetString(reader.GetOrdinal("answerName"));
                            if (questionId == QuestionHelper.Career)
                            {
                                avatar.career_id = answerName;
                            }
                            else if (questionId == QuestionHelper.Gender)
                            {
                                avatar.gender = answerName;
                            }
                            else if (questionId == QuestionHelper.HairColor)
                            {
                                avatar.hairColor = answerName;
                            }
                            else if (questionId == QuestionHelper.HairState)
                            {
                                avatar.hairType = answerName;
                            }
                            else if (questionId == QuestionHelper.HairLength)
                            {
                                avatar.hairLength = answerName;
                            }
                            else if (questionId == QuestionHelper.HairCurly)
                            {
                                avatar.hairCurly = answerName;
                            }
                        }
                    }
                }
            }

        }

        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var sceneUserAnswers = serializer.Serialize(userAnswers);
        var str_avatar = serializer.Serialize(avatar);
        var suggestions = SubmitAnswer(sceneUserAnswers, report_id, "");
        return string.Format("{{ \"user_answers\" : {0}, \"suggestions\" : {1}, \"avatar\" : {2} }}", sceneUserAnswers, suggestions, str_avatar);
    }
}
