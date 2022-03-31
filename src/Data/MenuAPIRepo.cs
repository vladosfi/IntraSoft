namespace IntraSoft.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;
    using Microsoft.EntityFrameworkCore;

    public class MenuAPIRepo : IMenuAPIRepo
    {
        private readonly ApplicationDbContext context;

        public MenuAPIRepo(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task CreateAsync(Menu item)
        {
            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }

            await this.context.Menus.AddAsync(item);
        }

        public async Task<IEnumerable<Menu>> GetAllAsync()
        {
            var fullMenus = await this.context.Menus.Include(x => x.Children).ToListAsync();
            return fullMenus.Where(x => x.ParentMenu == null).ToList();

            //var query = "SELECT * FROM Menus";
            //var employees = this.context.Menus.FromSqlRaw(query).ToArray();
            //return employees;
        }

        public async Task<Menu> GetByIdAsync(int id)
        {
            return await this.context.Menus.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await this.context.SaveChangesAsync() >= 0;
        }

        public void Update(Menu cmd)
        {
            // We don't need to do anything here
        }

        public void Delete(Menu item)
        {
            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }

            this.context.Menus.Remove(item);
        }
    }
}