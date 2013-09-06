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

    class UserAnswer
    {
        int question_id;
        int[] answer_ids;
    }

    [WebMethod]
    [ScriptMethod(UseHttpGet = false)]
    public string SubmitAnswer( string user_answers ) {
        JavaScriptSerializer serializer = new JavaScriptSerializer();
        var userAnswer = serializer.Deserialize<UserAnswer>(user_answers);
        return "";
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
