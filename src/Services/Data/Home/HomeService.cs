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
        private readonly IDeletableEntityRepository<IntraSoft.Data.Models.IsoService> isoServiceRepo;
        private readonly IDeletableEntityRepository<Order> orderRepo;

        public HomeService(IDeletableEntityRepository<IntraSoft.Data.Models.IsoService> isoServiceRepo, IDeletableEntityRepository<Order> orderRepo)
        {
            this.isoServiceRepo = isoServiceRepo;
            this.orderRepo = orderRepo;
        }

        public async Task<IEnumerable<T>> GetLastOrders<T>()
        {
            IQueryable<Order> query = this.orderRepo
                .All()
                .OrderByDescending(x => x.CreatedOn)
                .Take(3)
                .AsNoTracking();

                return await query.To<T>().ToListAsync();
        }

        public async Task<IEnumerable<T>> GetLastServices<T>()
        {
            IQueryable<IntraSoft.Data.Models.IsoService> query = this.isoServiceRepo
                .All()
                .OrderByDescending(x => x.CreatedOn)              
                .Take(3)
                .AsNoTracking();

            return await query.To<T>().ToListAsync();
        }
    }
}
