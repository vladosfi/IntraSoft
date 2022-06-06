namespace IntraSoft.Services.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IHomeService
    {
        Task<IEnumerable<T>> GetLastServices<T>();
        Task<IEnumerable<T>> GetLastOrders<T>();
    }
}
