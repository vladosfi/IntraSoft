namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IOrderCategoryService
    {
        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<int> CreateAsync(OrderCategory item);

    }
}
