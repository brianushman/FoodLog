using FoodLog.Contexts;
using FoodLog.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FoodLog.Controllers
{
    public class SearchEntriesController : ApiController
    {
        [HttpGet]
        [Route("api/SearchEntries/{term}")]
        public HttpResponseMessage Get(string term)
        {
            using (var context = new FoodJournalContext())
            {
                var entries = context.LogEntries.Where(m => m.Description.ToLower().Contains(term.ToLower())).Distinct().
                                                 OrderBy(m => m.Timestamp).ToArray();
                return Request.CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(entries, Formatting.None, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
            }
        }
    }
}
