using Conexion.AccesoDatos.Repository.Administracion;
using Conexion.AccesoDatos.Repository.Negocio;
using Conexion.AccesoDatos.Repository.Usuario;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace WebAppConexion
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);
            services.AddScoped<EmpleadoRepository>();
            services.AddScoped<PrmPerfilRepository>();
            services.AddScoped<LoginRepository>();
            services.AddScoped<PrmMenuRepository>();
            services.AddScoped<ClienteServicioRepository>();
            services.AddScoped<EmpresaRepository>();
            services.AddScoped<ProveedorRepository>();
            services.AddScoped<EnviarNotificacionRepository>();
            services.AddScoped<DocumentoTributarioRepository>();
            services.AddScoped<PagoRepository>();
            services.AddScoped<InventarioRepository>();
            services.AddScoped<PedidoRepository>();
            services.AddScoped<RecoFaceRepository>();
            services.AddScoped<GTHCapacitacionRepository>();
            services.AddScoped<GTHCelulaRepository>();
            services.AddScoped<GTHDepartamentoRepository>();
            services.AddScoped<GTHEmpleadoRepository>();
            services.AddScoped<GTHEntidadCapRepository>();
            services.AddScoped<GTHAsignacionCapacitacionRepository>();
            services.AddScoped<GTHSolicitudCapacitacionRepository>();
            services.AddScoped<GTHInformacionProfesionalRepository>();
            services.AddScoped<GTHFormacionAcademicaRepository>();
            services.AddScoped<GTHExperienciaLaboralRepository>();
            services.AddScoped<GTHHabilidadesRepository>();
            services.AddScoped<GTHHabInfoRepository>();
            services.AddScoped<GTHIdiomaRepository>();
            services.AddScoped<GTHIdiomaInfoRepository>();
            services.AddScoped<GTHLogroRepository>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            //services.AddDbContext<DbContextProyectoColegio>(options =>
            //    options.UseSqlServer(Configuration.GetConnectionString("Conexion")));

            services.AddCors(options => {
                options.AddPolicy("Todos",
                builder => builder.WithOrigins("*").WithHeaders("*").WithMethods("*"));
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["Jwt:Issuer"],
                        ValidAudience = Configuration["Jwt:Issuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                    };
                });

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAppConexion", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAppConexion v1"));
            }

            //app.UseCors(x =>
            //{
            //    x
            //    .AllowAnyOrigin()
            //    .AllowAnyMethod()
            //    .AllowAnyHeader()
            //    .AllowCredentials();
            //}
            //);
            app.UseCors("Todos");
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
