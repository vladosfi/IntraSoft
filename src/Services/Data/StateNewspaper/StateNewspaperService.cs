namespace IntraSoft.Services.Data.StateNewspaper
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class StateNewspaperService : IStateNewspaperService
    {
        private readonly IDeletableEntityRepository<StateNewspaper> stateNewspaperRepo;

        public StateNewspaperService(IDeletableEntityRepository<StateNewspaper> stateNewspaperRepo)
        {
            this.stateNewspaperRepo = stateNewspaperRepo;
        }

        public async Task<int> CreateAsync(StateNewspaper item)
        {
            await this.stateNewspaperRepo.AddAsync(item);
            await this.stateNewspaperRepo.SaveChangesAsync();
            return item.Id;
        }


        public async Task<IEnumerable<T>> GetAllForExportAsync<T>()
        {
            IQueryable<StateNewspaper> query =
                this.stateNewspaperRepo
                .All()
                .Select(c => new StateNewspaper()
                {
                    Title = c.Title,
                    Content = c.Content,
                    Link = c.Link,
                })
                .OrderBy(x => x.Id)
                .AsNoTracking()
                .AsSplitQuery();

            return await query.To<T>().ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsync<T>()
        {
            IQueryable<StateNewspaper> query =
                this.stateNewspaperRepo
                .All()
                .OrderByDescending(x => x.CreatedOn)
                .AsNoTracking()
                .AsSplitQuery();

            return await query.To<T>().ToListAsync();
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .stateNewspaperRepo
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        // No need to map
        public async Task<StateNewspaper> GetByIdAsync(int id)
        {
            return await this
                .stateNewspaperRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public void Delete(StateNewspaper item)
        {
            this.stateNewspaperRepo.Delete(item);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.stateNewspaperRepo.SaveChangesAsync();
        }

        public void Update(StateNewspaper item)
        {
            // We don't need to do anything here
        }
    }
}
