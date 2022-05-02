namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IIsoFileService
    {
        Task<int> CreateAsync(IsoFile item);

        Task<IEnumerable<IsoFile>> GetAllAsync();

        Task<T> GetByIdAsync<T>(int id);

        Task<IsoFile> GetByIdAsync(int id);

        void HardDelete(IsoFile item);

        void Update(IsoFile Item);

        Task<int> SaveChangesAsync();
    }
}
