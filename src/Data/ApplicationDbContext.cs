namespace IntraSoft.Data
{
    using System;
    using System.Linq;
    using System.Reflection;
    using System.Threading;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Data.Dtos.Document;
    using IntraSoft.Data.Models;
    using Microsoft.EntityFrameworkCore;

    public class ApplicationDbContext : DbContext
    {
        private static readonly MethodInfo
            SetIsDeletedQueryFilterMethod =
                typeof (ApplicationDbContext)
                    .GetMethod(nameof(SetIsDeletedQueryFilter),
                    BindingFlags.NonPublic | BindingFlags.Static);

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options
        ) :
            base(options)
        {
        }

        public DbSet<Department> Departments { get; set; }

        public DbSet<Menu> Menus { get; set; }

        public DbSet<Document> Documents { get; set; }

        public DbSet<Contact> Contacts { get; set; }

        public DbSet<IsoService> IsoServices { get; set; }

        public DbSet<IsoFile> IsoFiles { get; set; }

        public DbSet<IsoFileCategory> IsoFileCategories { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderCategory> OrderCategories { get; set; }

        public DbSet<MailMessage> MailMessages { get; set; }

        public override int SaveChanges() => this.SaveChanges(true);

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            this.ApplyAuditInfoRules();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override Task<int>
        SaveChangesAsync(CancellationToken cancellationToken = default) =>
            this.SaveChangesAsync(true, cancellationToken);

        public override Task<int>
        SaveChangesAsync(
            bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = default
        )
        {
            this.ApplyAuditInfoRules();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess,
            cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder
                .Entity<Menu>()
                .HasMany(m => m.Children)
                .WithOne(m => m.ParentMenu)
                .HasForeignKey(m => m.ParentId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<Document>()
                .HasOne(m => m.Menu)
                .WithOne(d => d.Document)
                .HasForeignKey<Document>(e => e.MenuId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<Department>()
                .HasMany(d => d.IsoServices)
                .WithOne(c => c.Department)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<IsoService>()
                .HasMany(d => d.IsoFiles)
                .WithOne(c => c.IsoService)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<IsoFileCategory>()
                .HasMany(f => f.IsoFiles)
                .WithOne(c => c.IsoFileCategory)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<OrderCategory>()
                .HasMany(o => o.Orders)
                .WithOne(c => c.OrderCategory)
                .OnDelete(DeleteBehavior.Restrict);

            var entityTypes = builder.Model.GetEntityTypes().ToList();

            // Set global query filter for not deleted entities only
            var deletableEntityTypes =
                entityTypes
                    .Where(et =>
                        et.ClrType != null &&
                        typeof (IDeletableEntity).IsAssignableFrom(et.ClrType));
            foreach (var deletableEntityType in deletableEntityTypes)
            {
                var method =
                    SetIsDeletedQueryFilterMethod
                        .MakeGenericMethod(deletableEntityType.ClrType);
                method.Invoke(null, new object[] { builder });
            }

            // Disable cascade delete
            var foreignKeys =
                entityTypes
                    .SelectMany(e =>
                        e
                            .GetForeignKeys()
                            .Where(f =>
                                f.DeleteBehavior == DeleteBehavior.Cascade));
            foreach (var foreignKey in foreignKeys)
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }

        private static void SetIsDeletedQueryFilter<T>(ModelBuilder builder)
            where T : class, IDeletableEntity
        {
            builder.Entity<T>().HasQueryFilter(e => !e.IsDeleted);
        }

        // Applies configurations
        private void ConfigureUserIdentityRelations(ModelBuilder builder) =>
            builder.ApplyConfigurationsFromAssembly(this.GetType().Assembly);

        private void ApplyAuditInfoRules()
        {
            var changedEntries =
                this
                    .ChangeTracker
                    .Entries()
                    .Where(e =>
                        e.Entity is IAuditInfo &&
                        (
                        e.State == EntityState.Added ||
                        e.State == EntityState.Modified
                        ));

            foreach (var entry in changedEntries)
            {
                var entity = (IAuditInfo) entry.Entity;
                if (
                    entry.State == EntityState.Added &&
                    entity.CreatedOn == default
                )
                {
                    entity.CreatedOn = DateTime.UtcNow;
                }
                else
                {
                    entity.ModifiedOn = DateTime.UtcNow;
                }
            }
        }
    }
}
