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
// Inside Program.cs, just before app.Run();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<mrittika.Server.Data.ApplicationDbContext>();

    // Check if there are already blogs
    if (!context.Blogs.Any())
    {
        context.Blogs.AddRange(
            new mrittika.Server.Models.Blog
            {
                Title = "Team Post: Handcrafted Clay",
                Content = "This is a shared post for the whole team to see.",
                AuthorName = "System",
                ImageUrl = "/hero1.jpg", // Use an image already in public/
                IsApproved = true,
                CreatedAt = DateTime.Now
            }
        );
        context.SaveChanges();
    }
}

app.Run();