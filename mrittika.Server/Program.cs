using Microsoft.EntityFrameworkCore;
using mrittika.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Simple routing for development
app.UseAuthorization();
app.MapControllers();

app.Run();