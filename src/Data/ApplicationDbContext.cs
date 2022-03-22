namespace WorldCities.Data
{
    using Microsoft.EntityFrameworkCore;
    using WorldCities.Data.Models;

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
    }
}