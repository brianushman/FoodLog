using FoodLog.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace FoodLog.Contexts
{
    public class FoodJournalContext : DbContext
    {
        public FoodJournalContext()
            : base("FoodJournalContext")
        {
            //Database.SetInitializer(new MigrateDatabaseToLatestVersion<LogEntryContext, Configuration>());
        }

        public DbSet<LogEntry> LogEntries { get; set; }
        public DbSet<User> Users { get; set; }
    }
}