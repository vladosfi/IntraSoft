namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IMenuService
    {
        Task<int> CreateAsync(Menu item);

        Task<IEnumerable<Menu>> GetAllAsync();

        Task<T> GetByIdAsync<T>(int id);

        Task<Menu> GetByIdAsync(int id);

        void HardDelete(Menu item);

        void Update(Menu menuItem);

        Task<int> SaveChangesAsync();
    }
}
