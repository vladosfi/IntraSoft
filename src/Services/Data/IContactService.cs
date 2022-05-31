namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IContactService
    {
        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<int> CreateAsync(Contact item);

        Task<T> GetByIdAsync<T>(int id);

        Task<Contact> GetByIdAsync(int id);

        void Delete(Contact item);

        void Update(Contact contactItem);

        Task<int> SaveChangesAsync();
    }
}
