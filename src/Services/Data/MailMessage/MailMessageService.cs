namespace IntraSoft.Services.Data.MailMessage
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class MailMessageService : IMailMessageService
    {
        private readonly IDeletableEntityRepository<MailMessage> mailMessageRepo;

        public MailMessageService(IDeletableEntityRepository<MailMessage> mailMessageRepo)
        {
            this.mailMessageRepo = mailMessageRepo;
        }

    
        public async Task<IEnumerable<T>> GetAllAsync<T>()
        {
            IQueryable<MailMessage> query =
                this
                    .mailMessageRepo
                    .All()
                    .OrderBy(x => x.Id)
                    .AsSplitQuery()
                    .AsNoTracking();

            return await query.To<T>().ToListAsync();
        }

        public async Task<int> CreateAsync(MailMessage item)
        {
            await this.mailMessageRepo.AddAsync(item);
            await this.mailMessageRepo.SaveChangesAsync();
            return item.Id;
        }

        public void Delete(MailMessage item)
        {
            this.mailMessageRepo.Delete(item);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.mailMessageRepo.SaveChangesAsync();
        }

        public void Update(MailMessage documentItem)
        {
            // We don't need to do anything here
        }
    }
}
