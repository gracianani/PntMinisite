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
    class SceneUserAnswer
    {
        public int scene_id;
        public UserAnswer[] user_answers;
    }

    class UserAnswer
    {
        public int question_id;
        public int[] answer_ids;
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = false)]
    public string SubmitAnswer( string user_answers ) {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var sceneUserAnswers = serializer.Deserialize<SceneUserAnswer[]>(user_answers);
        var userAnswerIds = new List<int>();
        var suggestionIds = new Dictionary<int, List<int>>() { 
            {1, new List<int>()}, 
            {2, new List<int>()},
            {3, new List<int>()}
        };
        var productIds = new List<int>();

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
            using( var command = new SqlCommand("FetchSuggestions", conn)) {
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.Parameters.AddWithValue("Answers", answerIdTable );
                conn.Open();
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
                }
            }
        }
        return string.Format("{{ \"lifestyle_suggestions\": \"{0}\" , \"haircare_suggestions\" : \"{2}\", \"hairsituation_suggestions\" : \"{3}\",  \"suggested_products\" : \"{1}\" }}", string.Join(",", suggestionIds[1]), string.Join(",", productIds), string.Join(",", suggestionIds[2]), string.Join(",", suggestionIds[3]));
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
}
