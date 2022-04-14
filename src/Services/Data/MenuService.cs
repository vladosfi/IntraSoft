
namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class MenuService : IMenuService
    {
        private readonly IDeletableEntityRepository<Menu> menusRepository;
        
        public MenuService(IDeletableEntityRepository<Menu> menusRepository)
        {
            this.menusRepository = menusRepository;
        }

        public IEnumerable<T> GetAll<T>(int? count)
        {
            IQueryable<Menu> query = this.menusRepository
                .All()
                .OrderBy(x => x.Text);

            if (count.HasValue)
            {
                query = query.Take(count.Value);
            }

            return query.To<T>().ToList();
        }

        public T GetByName<T>(string name)
            => this.menusRepository
                .All()
                .To<T>()
                .FirstOrDefault();

        public async Task<int> GetCountAsync() => await this.menusRepository.AllAsNoTracking().CountAsync();

    }
}
