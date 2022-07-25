namespace IntraSoft.Services.Data.StateNewspaper
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IStateNewspaperService
    {
        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<IEnumerable<T>> GetAllForExportAsync<T>();

        Task<int> CreateAsync(StateNewspaper item);

        Task<T> GetByIdAsync<T>(int id);

        Task<StateNewspaper> GetByIdAsync(int id);

        void Delete(StateNewspaper item);

        void Update(StateNewspaper item);

        Task<int> SaveChangesAsync();
    }
}
