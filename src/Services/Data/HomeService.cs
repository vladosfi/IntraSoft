namespace IntraSoft.Services.Data
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

        public HomeService(IDeletableEntityRepository<IntraSoft.Data.Models.IsoService> isoServiceRepo)
        {
            this.isoServiceRepo = isoServiceRepo;
        }


        public async Task<IEnumerable<T>> GetLastServices<T>()
        {
            IQueryable<IntraSoft.Data.Models.IsoService> query = this.isoServiceRepo
                .All()
                .OrderByDescending(x => x.CreatedOn)              
                .Take(5)
                .AsNoTracking();

            return await query.To<T>().ToListAsync();
        }
    }
}
