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

    public class DocumentService : IDocumentService
    {
        private readonly IDeletableEntityRepository<Document> documentRepo;

        public DocumentService(IDeletableEntityRepository<Document> documentRepo)
        {
            this.documentRepo = documentRepo;
        }

        public async Task<int> CreateAsync(Document item)
        {
            await this.documentRepo.AddAsync(item);
            await this.documentRepo.SaveChangesAsync();
            return item.Id;
        }

        public async Task<IEnumerable<Document>> GetAllAsync()
        {
            return await this.documentRepo.All().AsNoTracking().ToListAsync();
            
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .documentRepo
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        public async Task<Document> GetByIdAsync(int id)
        {
            return await this
                .documentRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public void HardDelete(Document item)
        {
            this.documentRepo.HardDelete(item);
        }

        public void Update(Document documentItem)
        {
            // We don't need to do anything here
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.documentRepo.SaveChangesAsync();
        }
    }
}
