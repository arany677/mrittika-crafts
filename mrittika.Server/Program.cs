using Microsoft.EntityFrameworkCore;
using mrittika.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Add services
builder.Services.AddControllers();

// Ensure the ConnectionString name matches EXACTLY with appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// 2. Middleware
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.MapControllers();

// 3. SEEDING/MIGRATION CHECK
// This block ensures seeding ONLY happens if we are NOT running a migration command
if (args.Length == 0 || !args[0].Contains("migrations"))
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            // Just ensure created, don't run complex logic here during Build
            context.Database.EnsureCreated();
        }
        catch (Exception ex)
        {
            Console.WriteLine("Startup Error: " + ex.Message);
        }
    }
}

app.Run();