namespace IntraSoft.Services.Data.Home
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class HomeService : IHomeService
    {
        private
        readonly IDeletableEntityRepository<IntraSoft.Data.Models.IsoService>
            isoServiceRepo;

        private readonly IDeletableEntityRepository<Order> orderRepo;

        private readonly IDeletableEntityRepository<StateNewspaper>
            stateNewspaperRepo;

        private readonly IDeletableEntityRepository<Home> homeRepo;

        public HomeService(
            IDeletableEntityRepository<IntraSoft.Data.Models.IsoService>
            isoServiceRepo,
            IDeletableEntityRepository<Order> orderRepo,
            IDeletableEntityRepository<StateNewspaper> stateNewspaperRepo,
            IDeletableEntityRepository<Home> homeRepo
        )
        {
            this.isoServiceRepo = isoServiceRepo;
            this.orderRepo = orderRepo;
            this.stateNewspaperRepo = stateNewspaperRepo;
            this.homeRepo = homeRepo;
        }

        public async Task<int> CreateAsync(Home item)
        {
            await this.homeRepo.AddAsync(item);
            await this.homeRepo.SaveChangesAsync();
            return item.Id;
        }


        public async Task<Home> GetByIdAsync(int id)
        {
            return await this
                .homeRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
                return await this
                    .homeRepo
                    .All()
                    .Where(x => x.Id == id)
                    .To<T>()
                    .FirstOrDefaultAsync();
        }

        public async Task<T> GetContent<T>()
        {
            return await this.homeRepo.All().To<T>().FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<T>> GetLastOrders<T>()
        {
            IQueryable<Order> query =
                this
                    .orderRepo
                    .All()
                    .OrderByDescending(x => x.CreatedOn)
                    .Take(3)
                    .AsNoTracking();

            return await query.To<T>().ToListAsync();
        }

        public async Task<IEnumerable<T>> GetLastServices<T>()
        {
            IQueryable<IntraSoft.Data.Models.IsoService> query =
                this
                    .isoServiceRepo
                    .All()
                    .OrderByDescending(x => x.CreatedOn)
                    .Take(3)
                    .AsNoTracking();

            return await query.To<T>().ToListAsync();
        }

        public async Task<IEnumerable<T>> GetLastStateNewspapers<T>()
        {
            IQueryable<StateNewspaper> query =
                this
                    .stateNewspaperRepo
                    .All()
                    .OrderByDescending(x => x.CreatedOn)
                    .Take(3)
                    .AsNoTracking();

            return await query.To<T>().ToListAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.homeRepo.SaveChangesAsync();
        }

        public void Update(Home item)
        {
            // We don't need to do anything here
        }
    }
}
