namespace IntraSoft.Services.Data.MailMessage
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IMailMessageService
    {
        Task<IEnumerable<T>> GetAllAsync<T>();
        
        Task<int> CreateAsync(MailMessage item);

        void Delete(MailMessage item);

        void Update(MailMessage documentItem);

        Task<int> SaveChangesAsync();

    }
}
