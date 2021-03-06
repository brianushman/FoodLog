﻿using FoodLog.Contexts;
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

        [HttpGet]
        [Route("api/LogEntries/{date}")]
        public HttpResponseMessage Get(DateTime date)
        {
            using (var context = new FoodJournalContext())
            {
                var entries = context.LogEntries.Where(m => m.Timestamp.Year == date.Year &&
                                                            m.Timestamp.Month == date.Month &&
                                                            m.Timestamp.Day == date.Day).
                                                 OrderBy(m => m.Timestamp).ToArray();
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

        [HttpPut]
        public HttpResponseMessage Put(LogEntry value)
        {
            value.UserId = GetFirstUser();
            using (var context = new FoodJournalContext())
            {
                var entity = context.LogEntries.Find(value.LogEntryId);
                if (entity == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, new Exception("Log Entry not found!"));
                }

                context.Entry(entity).CurrentValues.SetValues(value);
                if (context.SaveChanges() != 1) return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, new Exception("Unable to update LogEntry"));
                return Request.CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(entity, Formatting.None, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
            }
        }

        [HttpDelete]
        public HttpResponseMessage Delete(LogEntry value)
        {
            using (var context = new FoodJournalContext())
            {
                var entity = context.LogEntries.Find(value.LogEntryId);
                if (entity == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, new Exception("Log Entry not found!"));
                }

                var removed = context.LogEntries.Remove(entity);
                if (context.SaveChanges() != 1) return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, new Exception("Unable to remove LogEntry"));
                return Request.CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(removed, Formatting.None, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
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
