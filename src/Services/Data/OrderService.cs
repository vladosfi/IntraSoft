namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class OrderService : IOrderService
    {
        private readonly IDeletableEntityRepository<Order> orderRepo;

        public OrderService(IDeletableEntityRepository<Order> orderRepo)
        {
            this.orderRepo = orderRepo;
        }

        public async Task<int> CreateAsync(Order orderItem)
        {
            await this.orderRepo.AddAsync(orderItem);
            await this.orderRepo.SaveChangesAsync();
            return orderItem.Id;
        }

        public async Task<IEnumerable<T>> GetAllAsync<T>()
        {
            IQueryable<Order> query =
                this.orderRepo
                .All()
                .Select(o => new Order(){
                    Id = o.Id,
                    Number = o.Number,
                    Date = o.Date,
                    About = o.About,   
                    FilePath = o.FilePath,                 
                    Category = o.Category,
                })
                .OrderBy(x => x.Id)
                .AsNoTracking()
                .AsSplitQuery();

            return await query.To<T>().ToListAsync();
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .orderRepo
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        // No need to map
        public async Task<Order> GetByIdAsync(int id)
        {
            return await this
                .orderRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public void Delete(Order orderItem)
        {
            this.orderRepo.Delete(orderItem);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.orderRepo.SaveChangesAsync();
        }

        public void Update(Order orderItem)
        {
            // We don't need to do anything here
        }
    }
}
