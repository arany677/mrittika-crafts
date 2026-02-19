using Microsoft.EntityFrameworkCore;
using mrittika.Server.Models;
using System.Collections.Generic;

namespace mrittika.Server.Data
{
    // This class is the bridge between your C# code and the SQL Database
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // This line tells the database to create a table called "Products"
        public DbSet<Product> Products { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }
    }
}