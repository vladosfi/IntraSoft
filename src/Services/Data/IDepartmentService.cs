namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IDepartmentService
    {
        Task<int> CreateAsync(Department item);

        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<T> GetByIdAsync<T>(int id);

        Task<Department> GetByIdAsync(int id);

        void Delete(Department item);

        void Update(Department menuItem);

        Task<int> SaveChangesAsync();
    }
}
