using Microsoft.EntityFrameworkCore;
using mrittika.Server.Models;
using System.Collections.Generic;

namespace mrittika.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }


        // This method is called when the database is being created.
        // We use it to configure column types that EF can't guess automatically.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Fix for the Decimal Warnings: Specify precision and scale for currency/prices

            // 1. For Blog Price
            modelBuilder.Entity<Blog>()
                .Property(b => b.Price)
                .HasColumnType("decimal(18,2)");

            // 2. For Order Total Amount
            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasColumnType("decimal(18,2)");

            // 3. For OrderItem individual Price
            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasColumnType("decimal(18,2)");

            // Optional: You can also add validation constraints here if needed
            modelBuilder.Entity<ContactMessage>()
                .Property(c => c.Email)
                .IsRequired();
        }
    }
}