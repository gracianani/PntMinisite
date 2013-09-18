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
public class WeiboWebServices : System.Web.Services.WebService
{

    public WeiboWebServices()
    {

        //Uncomment the following line if using designed components 
        //InitializeComponent(); 
    }
    public static class QuestionHelper
    {
        public static int Gender = 22;
        public static int HairLength = 13;
        public static int HairColor = 15;
        public static int HairCurly = 14;
        public static int HairState = 16;
        public static int Career = 24;
    }
    public static class SuggestionGroupHelper
    {
        public static int LifeStyle = 1;
        public static int HairCare = 2;
        public static int HairSituation = 3;
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
            browser.Navigate(m_Url);
            //browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(WebBrowser_DocumentCompleted);
            var startTime = DateTime.Now.Ticks;
            while (browser.IsBusy ||
                browser.ReadyState != WebBrowserReadyState.Complete ||
                browser.Document == null ||
                browser.Document.GetElementById("report") == null ||
                        string.IsNullOrEmpty(browser.Document.GetElementById("report").InnerHtml))
            {
                System.Windows.Forms.Application.DoEvents();
                var endTime = DateTime.Now.Ticks;
                var timeSpan = new TimeSpan(endTime - startTime);
                if (timeSpan.Seconds > 20)
                {
                    break;
                }
            }
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

    class Suggestion
    {
        public int answer_id;
        public string answer_text;
        public int scene_id;
        public string scene_text;
        public List<int> suggestion_ids;
    }

    class QuizResponse
    {
        public int quizId;
        public int score;
        public decimal ranking;
        public string suggested_products;
        public List<Suggestion> hairsituation_suggestions;
        public List<Suggestion> haircare_suggestions;
        public List<Suggestion> lifestyle_suggestions;

    }
    class Avatar
    {
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

    private void GetUserAnswers(IDataReader reader, out List<SceneUserAnswer> userAnswers, out Avatar avatar, out int reportId)
    {
        userAnswers = new List<SceneUserAnswer>();
        avatar = new Avatar();
        reportId = 0;
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

    private bool HasReport(int report_id)
    {
        string connStr = ConfigurationManager.ConnectionStrings["pnt"].ConnectionString;
        using (var conn = new SqlConnection(connStr))
        {
            conn.Open();
            using (var command = new SqlCommand("HasReport", conn))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("reportId", report_id);
                var hasReport = command.ExecuteScalar();
                if (hasReport.ToString() == "1")
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = false)]
    public string LogAnswer(string user_answers, int quizId, string str_user)
    {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var sceneUserAnswers = serializer.Deserialize<SceneUserAnswer[]>(user_answers);
        var user = serializer.Deserialize<User>(str_user);
        var suggestionIds = new Dictionary<int, List<Suggestion>>() { 
            {SuggestionGroupHelper.HairSituation, new List<Suggestion>()}, 
            {SuggestionGroupHelper.LifeStyle, new List<Suggestion>()},
            {SuggestionGroupHelper.HairCare, new List<Suggestion>()}
        };
        var userAnswerIds = new List<int>();
        foreach (SceneUserAnswer sceneUserAnswer in sceneUserAnswers)
        {
            var answer_ids = sceneUserAnswer.user_answers.Select(i => i.answer_ids).ToList();
            foreach (var answer_id in answer_ids)
            {
                userAnswerIds.AddRange(answer_id);
            }
        }

        DataTable answerIdTable = new DataTable("AnswersTableType");
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
            using (var command = new SqlCommand("LogUserAnswers", conn))
            {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("Answers", answerIdTable);
                if (!string.IsNullOrEmpty(user.qq_uid))
                {
                    command.Parameters.AddWithValue("QQUID", user.qq_uid);
                }
                if (!string.IsNullOrEmpty(user.weibo_uid))
                {
                    command.Parameters.AddWithValue("WeiboUID", user.weibo_uid);
                }
                quizId = Convert.ToInt32(command.ExecuteScalar());
            }
        }
        return string.Format(" {{ \"quizId\" : \"{0}\" }} ", quizId);
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = false)]
    public string GetSuggestions(string user_answers, int quizId, string str_user)
    {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var sceneUserAnswers = serializer.Deserialize<SceneUserAnswer[]>(user_answers);
        var user = serializer.Deserialize<User>(str_user);
        var userAnswerIds = new List<int>();
        var suggestionIds = new Dictionary<int, List<Suggestion>>() { 
            {SuggestionGroupHelper.HairSituation, new List<Suggestion>()}, 
            {SuggestionGroupHelper.LifeStyle, new List<Suggestion>()},
            {SuggestionGroupHelper.HairCare, new List<Suggestion>()}
        };
        var productIds = new List<int>();
        var score = 0.0m;
        var ranking = 0.0m;
        foreach (SceneUserAnswer sceneUserAnswer in sceneUserAnswers)
        {
            var answer_ids = sceneUserAnswer.user_answers.Select(i => i.answer_ids).ToList();
            foreach (var answer_id in answer_ids)
            {
                userAnswerIds.AddRange(answer_id);
            }
        }

        DataTable answerIdTable = new DataTable("AnswersTableType");
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
            using (var command = new SqlCommand("FetchSuggestions", conn))
            {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("Answers", answerIdTable);
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var groupId = reader.GetInt32(reader.GetOrdinal("suggestionGroupId"));
                        var suggestionId = reader.GetInt32(reader.GetOrdinal("suggestionId"));
                        var answerId = reader.GetInt32(reader.GetOrdinal("answerId"));
                        var answerText = reader.GetString(reader.GetOrdinal("answerText"));
                        var sceneId = reader.GetInt32(reader.GetOrdinal("sceneId"));
                        var sceneText = reader.GetString(reader.GetOrdinal("sceneName"));
                        suggestionIds[groupId].Add(new Suggestion { answer_text = answerText, answer_id = answerId, scene_text = sceneText, scene_id = sceneId, suggestion_ids = new List<int>() { suggestionId } });
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
                            score = reader.GetInt32(0);
                        }
                    }
                    if (reader.NextResult())
                    {
                        if (reader.Read())
                        {
                            ranking = reader.GetInt32(0);
                        }
                    }
                }
            }
        }
        var quizResponse = new QuizResponse()
        {
            quizId = quizId,
            haircare_suggestions = (from suggestion in suggestionIds[SuggestionGroupHelper.HairCare]
                                    group suggestion by new { sceneId = suggestion.scene_id, sceneText = suggestion.scene_text } into scene
                                    select new Suggestion { scene_id = scene.Key.sceneId, scene_text = scene.Key.sceneText, suggestion_ids = scene.Select(i => i.suggestion_ids[0]).Distinct().ToList() }).ToList(),
            suggested_products = string.Join(",", productIds),
            lifestyle_suggestions = (from suggestion in suggestionIds[SuggestionGroupHelper.LifeStyle]
                                     group suggestion by new { sceneId = suggestion.scene_id, sceneText = suggestion.scene_text } into scene
                                     select new Suggestion { scene_id = scene.Key.sceneId, scene_text = scene.Key.sceneText, suggestion_ids = scene.Select(i => i.suggestion_ids[0]).Distinct().ToList() }).ToList(),
            hairsituation_suggestions = (from suggestion in suggestionIds[SuggestionGroupHelper.HairSituation]
                                         group suggestion by new { ansId = suggestion.answer_id, ansText = suggestion.answer_text } into ans
                                         select new Suggestion { answer_id = ans.Key.ansId, answer_text = ans.Key.ansText, suggestion_ids = ans.Select(i => i.suggestion_ids[0]).Distinct().ToList() }).ToList(),
            score = Convert.ToInt32(score / 3),
            ranking = ranking
        };
        return serializer.Serialize(quizResponse);
    }

    [WebMethod]
    public bool Share(int report_id)
    {
        if (HasReport(report_id))
        {
            var imageUrl = string.Format(Server.MapPath("reports") + "\\report_{0}.png", report_id);
            if (!File.Exists(imageUrl))
            {
                var pageUrl = ConfigurationManager.AppSettings["BaseUrl"] + "report.html?reportId=" + report_id;
                WebsiteToImage websiteToImage = new WebsiteToImage(pageUrl, imageUrl);
                websiteToImage.Generate();
            }
        }
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
                if (!string.IsNullOrEmpty(user.qq_uid))
                {
                    command.Parameters.AddWithValue("QQUid", user.qq_uid);
                }
                using (var reader = command.ExecuteReader())
                {
                    GetUserAnswers(reader, out userAnswers, out avatar, out reportId);
                }
            }
        }

        var sceneUserAnswers = serializer.Serialize(userAnswers);
        var str_avatar = serializer.Serialize(avatar);
        var suggestions = "";
        if (reportId != 0)
        {
            suggestions = GetSuggestions(sceneUserAnswers, reportId, "");
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
                    GetUserAnswers(reader, out userAnswers, out avatar, out report_id);
                }
            }
        }

        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var sceneUserAnswers = serializer.Serialize(userAnswers);
        var str_avatar = serializer.Serialize(avatar);
        var suggestions = GetSuggestions(sceneUserAnswers, report_id, "");
        return string.Format("{{ \"user_answers\" : {0}, \"suggestions\" : {1}, \"avatar\" : {2} }}", sceneUserAnswers, suggestions, str_avatar);
    }
}