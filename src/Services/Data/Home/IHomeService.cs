namespace IntraSoft.Services.Data.Home
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using IntraSoft.Data.Models;

    public interface IHomeService
    {
        Task<IEnumerable<T>> GetLastServices<T>();

        Task<IEnumerable<T>> GetLastOrders<T>();

        Task<IEnumerable<T>> GetLastStateNewspapers<T>();

        Task<T> GetContent<T>();

        Task<int> CreateAsync(Home item);

        Task<Home> GetByIdAsync(int id);

        Task<T> GetByIdAsync<T>(int id);

        void Update(Home item);

        Task<int> SaveChangesAsync();
    }
}
