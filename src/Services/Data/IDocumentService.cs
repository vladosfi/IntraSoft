namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IDocumentService
    {
        Task<int> CreateAsync(Document item);

        Task<IEnumerable<Document>> GetAllAsync();

        Task<T> GetByIdAsync<T>(int id);

        Task<Document> GetByIdAsync(int id);

        void HardDelete(Document item);

        void Update(Document documentItem);

        Task<int> SaveChangesAsync();
    }
}
