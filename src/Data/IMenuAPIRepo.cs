namespace IntraSoft.Data
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;

    public interface IMenuAPIRepo
    {
        Task<bool> SaveChangesAsync();

        Task<IEnumerable<Menu>> GetAllAsync();

        //Task<IEnumerable<Menu>> GetAllSubMenusAsync(int parrentMenuId);

        Task<Menu> GetByIdAsync(int id);

        Task CreateAsync(Menu item);

        void Update(Menu item);

        void Delete(Menu item);
    }
}
