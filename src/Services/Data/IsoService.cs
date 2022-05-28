namespace IntraSoft.Services.Data
{
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class IsoService : IIsoService
    {
        private readonly IDeletableEntityRepository<IntraSoft.Data.Models.IsoService> isoServiceRepo;

        public IsoService(IDeletableEntityRepository<IntraSoft.Data.Models.IsoService> isoServiceRepo)
        {
            this.isoServiceRepo = isoServiceRepo;
        }

        public async Task<IEnumerable<T>> GetAllAsync<T>()
        {
            IQueryable<IntraSoft.Data.Models.IsoService> query = this.isoServiceRepo
                .All()
                .OrderBy(x => x.DepartmentId)
                .Include(i => i.IsoFiles)
                    .ThenInclude(c => c.IsoFileCategory)                    
                .AsSplitQuery()
                .AsNoTracking();

            return await query.To<T>().ToListAsync();
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .isoServiceRepo
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.isoServiceRepo.SaveChangesAsync();
        }


        public async Task<int> CreateAsync(IntraSoft.Data.Models.IsoService item)
        {
            await this.isoServiceRepo.AddAsync(item);
            await this.isoServiceRepo.SaveChangesAsync();
            return item.Id;
        }

        // No need to map
        public async Task<IntraSoft.Data.Models.IsoService> GetByIdAsync(int id)
        {
            return await this
                .isoServiceRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public void Delete(IntraSoft.Data.Models.IsoService serviceItem)
        {
            this.isoServiceRepo.Delete(serviceItem);
        }

        public void Update(IntraSoft.Data.Models.IsoService menuItem)
        {
            // We don't need to do anything here
        }
    }
}
