namespace IntraSoft.Services.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class IsoFileCategoryService : IIsoFileCategoryService
    {
        private readonly IDeletableEntityRepository<IsoFileCategory> isoFileCategoryRepo;

        public IsoFileCategoryService(IDeletableEntityRepository<IsoFileCategory> isoFileCategoryRepo)
        {
            this.isoFileCategoryRepo = isoFileCategoryRepo;
        }

        public async Task<int> CreateAsync(IsoFileCategory item)
        {
            await this.isoFileCategoryRepo.AddAsync(item);
            await this.isoFileCategoryRepo.SaveChangesAsync();
            return item.Id;
        }

        public async Task<IEnumerable<T>> GetAllAsync<T>()
        {
            IQueryable<IsoFileCategory> query = this.isoFileCategoryRepo
            .All()
            .OrderBy(x => x.Id)
            .AsSplitQuery()
            .AsNoTracking();

            return await query.To<T>().ToListAsync();
        }


        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .isoFileCategoryRepo
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        public async Task<IsoFileCategory> GetByIdAsync(int id)
        {
            return await this
                .isoFileCategoryRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public void Update(IsoFileCategory documentItem)
        {
            // We don't need to do anything here
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.isoFileCategoryRepo.SaveChangesAsync();
        }

        public void Delete(IsoFileCategory item)
        {
            this.isoFileCategoryRepo.Delete(item);
        }
    }
}
