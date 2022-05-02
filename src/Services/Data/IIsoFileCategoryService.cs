namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IIsoFileCategoryService
    {
        Task<int> CreateAsync(IsoFileCategory item);

        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<T> GetByIdAsync<T>(int id);

        Task<IsoFileCategory> GetByIdAsync(int id);

        void Delete(IsoFileCategory item);

        void Update(IsoFileCategory menuItem);

        Task<int> SaveChangesAsync();
    }
}
