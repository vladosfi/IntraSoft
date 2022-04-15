namespace IntraSoft.Services.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class MenuService : IMenuService
    {
        private readonly IDeletableEntityRepository<Menu> context;

        public MenuService(IDeletableEntityRepository<Menu> context)
        {
            this.context = context;
        }

        public async Task<int> CreateAsync(Menu menuItem)
        {
            if (menuItem == null)
            {
                throw new ArgumentNullException(nameof(menuItem));
            }

            await this.context.AddAsync(menuItem);
            await this.context.SaveChangesAsync();
            return menuItem.Id;
        }

        public void Delete(Menu menuItem)
        {
            if (menuItem == null)
            {
                throw new ArgumentNullException(nameof(menuItem));
            }

            this.context.HardDelete(menuItem);
        }

        public IEnumerable<T> GetAllAsync<T>()
        {
            IQueryable<Menu> query = this.context.All().OrderBy(x => x.Text);

            return query.To<T>().ToList();
        }

        public T GetById<T>(int id)
        {
            return this
                .context
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefault();
        }
    }
}
