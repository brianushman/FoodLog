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

        [HttpPost]
        public HttpResponseMessage Post(LogEntry value)
        {
            value.UserId = Guid.Parse("91ff6cf4-f503-4cc2-825b-89027c16e6cf");
            using (var context = new FoodJournalContext())
            {
                var addedEntry = context.LogEntries.Add(value);
                if (context.SaveChanges() != 1) return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, new Exception("Unable to save LogEntry"));
                return Request.CreateResponse(HttpStatusCode.OK, JsonConvert.SerializeObject(addedEntry, Formatting.None, new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore }));
            }
        }
    }
}
