using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodLog.Contexts
{
    public class DatabaseInitializer : System.Data.Entity.CreateDatabaseIfNotExists<FoodJournalContext>
    {
        protected override void Seed(FoodJournalContext context)
        {
        }
    }
}