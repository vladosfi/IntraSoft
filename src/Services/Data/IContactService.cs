namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IContactService
    {
        Task<int> CreateAsync(Contact item);

        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<T> GetByIdAsync<T>(int id);

        Task<Contact> GetByIdAsync(int id);

        void Delete(Contact item);

        void Update(Contact menuItem);

        Task<int> SaveChangesAsync();
    }
}
