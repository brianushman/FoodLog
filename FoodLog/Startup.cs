using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FoodLog.Startup))]
namespace FoodLog
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
