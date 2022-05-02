namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IIsoService
    {
        Task<int> CreateAsync(IntraSoft.Data.Models.IsoService item);

        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<T> GetByIdAsync<T>(int id);

        Task<IntraSoft.Data.Models.IsoService> GetByIdAsync(int id);

        void Delete(IntraSoft.Data.Models.IsoService item);

        void Update(IntraSoft.Data.Models.IsoService menuItem);

        Task<int> SaveChangesAsync();
    }
}
