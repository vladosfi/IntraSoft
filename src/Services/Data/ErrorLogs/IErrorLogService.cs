namespace IntraSoft.Services.Data.ErrorLogs
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IErrorLogService
    {
        Task<IEnumerable<T>> GetAllAsync<T>();

        Task<int> CreateAsync(Log item);

        Task<T> GetByIdAsync<T>(int id);

        Task<Log> GetByIdAsync(int id);

        void Delete(Log item);

        void Update(Log item);

        Task<int> SaveChangesAsync();
    }
}
