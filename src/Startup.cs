namespace IntraSoft
{
    using System.Reflection;
    using IntraSoft.Data;
    using IntraSoft.Data.Common;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Repositories;
    using IntraSoft.Services.Data;
    using IntraSoft.Services.Data.Contact;
    using IntraSoft.Services.Data.Home;
    using IntraSoft.Services.Data.MailMessage;
    using IntraSoft.Services.Data.Menu;
    using IntraSoft.Services.Data.Order;
    using IntraSoft.Services.Data.OrderCategory;
    using IntraSoft.Services.Mail;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http.Features;
    using Microsoft.AspNetCore.SpaServices.AngularCli;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;

    public class Startup
    {
        private readonly IWebHostEnvironment currentEnvironment;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            this.Configuration = configuration;
            this.currentEnvironment = env;
        }
        
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            if (this.currentEnvironment.IsDevelopment())
            {
                // Show SQL queries in dev mode
                services.AddDbContext<ApplicationDbContext>(x => x.UseSqlite(this.Configuration.GetConnectionString("DefaultConnection")).EnableSensitiveDataLogging());
            }
            else
            {
                services.AddDbContext<ApplicationDbContext>(x => x.UseSqlite(this.Configuration.GetConnectionString("DefaultConnection")));
            }

            services.Configure<FormOptions>(o =>
           {
               o.ValueLengthLimit = int.MaxValue;
               o.MultipartBodyLengthLimit = int.MaxValue;
               o.MemoryBufferThreshold = int.MaxValue;
           });

            object p = services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            services.Configure<FormOptions>(options =>
            {
                // Set the limit size to 20 MB
                options.MultipartBodyLengthLimit = 20 * 1024 * 1024;
            });

            // Data repositories
            services.AddScoped(typeof(IDeletableEntityRepository<>), typeof(EfDeletableEntityRepository<>));
            services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
            services.AddScoped<IDbQueryRunner, DbQueryRunner>();

            services.AddScoped<IEmailSender, EmailSender>();
            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            // Application services
            services.AddTransient<IMenuService, MenuService>();
            services.AddTransient<IContactService, ContactService>();
            services.AddTransient<IDepartmentService, DepartmentService>();
            services.AddTransient<IDocumentService, DocumentService>();
            services.AddTransient<IIsoService, IsoService>();
            services.AddTransient<IIsoFileService, IsoFileService>();
            services.AddTransient<IIsoFileCategoryService, IsoFileCategoryService>();
            services.AddTransient<IHomeService, HomeService>();
            services.AddTransient<IOrderCategoryService, OrderCategoryService>();
            services.AddTransient<IOrderService, OrderService>();
            services.AddTransient<IMailMessageService, MailMessageService>();

            services.AddSingleton(Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>());


            services.AddControllersWithViews();

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            AutoMapperConfig.RegisterMappings(typeof(ApplicationDbContext).GetTypeInfo().Assembly);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");

                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }


            app.UseHttpsRedirection();

            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = (context) =>
                {
                    // Retrieve cache configuration from appsettings.json
                    context.Context.Response.Headers["Cache-Control"] = this.Configuration["StaticFiles:Headers:Cache-Control"];
                },
            });

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core, see https://go.microsoft.com/fwlink/?linkid=864501
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
