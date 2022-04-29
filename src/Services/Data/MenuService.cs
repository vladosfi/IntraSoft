namespace IntraSoft.Services.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class MenuService : IMenuService
    {
        private readonly IDeletableEntityRepository<Menu> menuRepo;
        private readonly ApplicationDbContext context;

        public MenuService(IDeletableEntityRepository<Menu> menuRepo, ApplicationDbContext context)
        {
            this.menuRepo = menuRepo;
            this.context = context;
        }

        public async Task<int> CreateAsync(Menu menuItem)
        {
            await this.menuRepo.AddAsync(menuItem);
            await this.menuRepo.SaveChangesAsync();
            return menuItem.Id;
        }

        public void HardDelete(Menu menuItem)
        {
            this.menuRepo.HardDelete(menuItem);
        }

        public async Task<IEnumerable<Menu>> GetAllAsync()
        {
            //IQueryable<Menu> query = this.context
            //    .All()
            //    .Include(x => x.Children)
            //    .ThenInclude(x => x.ParentMenu)
            //    .Where(x => x.Children.Count >= 0)
            //    .OrderBy(x => x.Id);
            //var menuItems = await query.To<T>().ToListAsync();
            //return menuItems;

            var menuItems = await this.context.Menus.Include(x => x.Children).ToListAsync();
            return menuItems.Where(x => x.ParentMenu == null).ToList();

        // var menuItems = await this.context.Menus.Include(x => x.Children).Include(d => d.Document).ToListAsync();
        // return menuItems.Where(x => x.ParentMenu == null).ToList();

            // IQueryable<Menu> query = this.menuRepo
            //    .All()
            //    .Include(x => x.Children)
            //    .Include(d => d.Document)
            //    .Where(x => x.Children.Count >= 0)
            //    .OrderBy(x => x.Id);
            // var menuItems = await query.To<T>().ToListAsync();
            // return menuItems;
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .menuRepo
                .All()
                .Include(d => d.Document)
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        // No need to map
        public async Task<Menu> GetByIdAsync(int id)
        {
            return await this
                .menuRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public void Update(Menu menuItem)
        {
            // We don't need to do anything here
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.menuRepo.SaveChangesAsync();
        }
    }
}
