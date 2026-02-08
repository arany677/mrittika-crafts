using Microsoft.EntityFrameworkCore;
using mrittika.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// --- CRITICAL ORDER ---
app.UseDefaultFiles(); // Add this
app.UseStaticFiles();  // This allows the browser to see the wwwroot/uploads folder

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();