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
    public class LogEntriesController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Get()
        {
            using (var context = new FoodJournalContext())
            {
                var entries = context.LogEntries.ToArray();
                return Request.CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(entries, Formatting.None, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
            }
        }

        [HttpPost]
        public HttpResponseMessage Post(LogEntry value)
        {
            value.UserId = GetFirstUser();
            using (var context = new FoodJournalContext())
            {
                var addedEntry = context.LogEntries.Add(value);
                if (context.SaveChanges() != 1) return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, new Exception("Unable to save LogEntry"));
                return Request.CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(addedEntry, Formatting.None, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
            }
        }

        private Guid GetFirstUser()
        {
            using (var context = new FoodJournalContext())
            {
                if (context.Users.Count() == 0) CreateFirstUser();
                return context.Users.First().UserId;
            }
        }

        private void CreateFirstUser()
        {
            using (var context = new FoodJournalContext())
            {
                context.Users.Add(new Models.User { FirstName = "Brian", LastName = "Ushman", Email = "brianushman@gmail.com" });
                context.SaveChanges();
            }
        }
    }
}
