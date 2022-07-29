namespace IntraSoft.Services.Data.Home
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IHomeService
    {
        Task<IEnumerable<T>> GetLastServices<T>();

        Task<IEnumerable<T>> GetLastOrders<T>();

        Task<IEnumerable<T>> GetLastStateNewspapers<T>();

        Task<T> GetContent<T>();
    }
}
