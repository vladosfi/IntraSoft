namespace IntraSoft.Data
{
    using IntraSoft.Data.Dtos.Document;
    using IntraSoft.Data.Models;
    using Microsoft.EntityFrameworkCore;

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext()
            : base()
        {
        }

        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<City> Cities { get; set; }

        public DbSet<Country> Countries { get; set; }

        public DbSet<Menu> Menus { get; set; }

        public DbSet<Document> Documents { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Menu>()
                .HasMany(m => m.Children)
                .WithOne(m => m.ParentMenu)
                .HasForeignKey(m => m.ParentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}