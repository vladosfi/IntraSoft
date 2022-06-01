namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class OrderCategoryService : IOrderCategoryService
    {
        private readonly IDeletableEntityRepository<OrderCategory>
            orderCategoryRepo;

        public OrderCategoryService(
            IDeletableEntityRepository<OrderCategory> orderCategoryRepo
        )
        {
            this.orderCategoryRepo = orderCategoryRepo;
        }

        public async Task<IEnumerable<T>> GetAllAsync<T>()
        {
            IQueryable<OrderCategory> query =
                this
                    .orderCategoryRepo
                    .All()
                    .OrderBy(x => x.Id)
                    .AsNoTracking()
                    .AsSplitQuery();

            return await query.To<T>().ToListAsync();
        }

        public async Task<int> CreateAsync(OrderCategory item)
        {
            await this.orderCategoryRepo.AddAsync(item);
            await this.orderCategoryRepo.SaveChangesAsync();
            return item.Id;
        }
    }
}
