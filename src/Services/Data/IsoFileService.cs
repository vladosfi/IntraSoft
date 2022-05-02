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

    public class IsoFileService : IIsoFileService
    {
        private readonly IDeletableEntityRepository<IsoFile> isoFileRepo;

        public IsoFileService(IDeletableEntityRepository<IsoFile> isoFileRepo)
        {
            this.isoFileRepo = isoFileRepo;
        }

        public async Task<int> CreateAsync(IsoFile item)
        {
            await this.isoFileRepo.AddAsync(item);
            await this.isoFileRepo.SaveChangesAsync();
            return item.Id;
        }

        public async Task<IEnumerable<IsoFile>> GetAllAsync()
        {
            return await this.isoFileRepo.All().AsNoTracking().ToListAsync();            
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .isoFileRepo
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        public async Task<IsoFile> GetByIdAsync(int id)
        {
            return await this
                .isoFileRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public void HardDelete(IsoFile item)
        {
            this.isoFileRepo.HardDelete(item);
        }

        public void Update(IsoFile documentItem)
        {
            // We don't need to do anything here
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.isoFileRepo.SaveChangesAsync();
        }
    }
}
