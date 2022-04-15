namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IMenuService
    {
        Task<int> CreateAsync(Menu item);

        IEnumerable<T> GetAllAsync<T>();

        T GetById<T>(int id);

        void Delete(Menu item);
    }
}
