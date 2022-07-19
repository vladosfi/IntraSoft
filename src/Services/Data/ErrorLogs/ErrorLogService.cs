namespace IntraSoft.Services.Data.ErrorLogs
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class ErrorLogService : IErrorLogService
    {
        private readonly IDeletableEntityRepository<Log> errorLogRepo;

        public ErrorLogService(IDeletableEntityRepository<Log> errorLogRepo)
        {
            this.errorLogRepo = errorLogRepo;
        }

        public async Task<int> CreateAsync(Log logItem)
        {
            await this.errorLogRepo.AddAsync(logItem);
            await this.errorLogRepo.SaveChangesAsync();
            return logItem.Id;
        }



        public async Task<IEnumerable<T>> GetAllAsync<T>()
        {
                IQueryable<Log> query =
                    this.errorLogRepo
                    .All()
                    .OrderBy(x => x.CreatedOn)
                    .AsNoTracking()
                    .AsSplitQuery();

            return await query.To<T>().ToListAsync();
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .errorLogRepo
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        // No need to map
        public async Task<Log> GetByIdAsync(int id)
        {
            return await this
                .errorLogRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public void Delete(Log item)
        {
            this.errorLogRepo.Delete(item);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.errorLogRepo.SaveChangesAsync();
        }

        public void Update(Log item)
        {
            // We don't need to do anything here
        }
    }
}
