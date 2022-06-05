namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IOrderService
    {
        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<int> CreateAsync(Order item);

        Task<T> GetByIdAsync<T>(int id);

        Task<Order> GetByIdAsync(int id);

        void Delete(Order item);

        void Update(Order menuItem);

        Task<int> SaveChangesAsync();
    }
}
