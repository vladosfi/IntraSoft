namespace IntraSoft.Services.Data.OrderCategory
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IOrderCategoryService
    {
        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<int> CreateAsync(OrderCategory item);

        Task<T> GetByIdAsync<T>(int id);

        Task<OrderCategory> GetByIdAsync(int id);
    }
}
