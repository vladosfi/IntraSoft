namespace IntraSoft.Services.Data
{
    using IntraSoft.Data;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class DepartmentService : IDepartmentService
    {
        private readonly IDeletableEntityRepository<Department> departmentRepo;

        public DepartmentService(IDeletableEntityRepository<Department> departmentRepo)
        {
            this.departmentRepo = departmentRepo;
        }

        public async Task<int> AddAsync(Department departmentItem)
        {
            await this.departmentRepo.AddAsync(departmentItem);
            await this.departmentRepo.SaveChangesAsync();
            return departmentItem.Id;
        }

        public async Task<IEnumerable<T>> GetAllAsync<T>()
        {
            IQueryable<Department> query = this.departmentRepo
                .All()
                .OrderBy(x => x.Id).AsSplitQuery().AsNoTracking();

            return await query.To<T>().ToListAsync();
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .departmentRepo
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        // No need to map
        public async Task<Department> GetByIdAsync(int id)
        {
            return await this
                .departmentRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }


        public void Delete(Department departmentItem)
        {
            this.departmentRepo.Delete(departmentItem);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.departmentRepo.SaveChangesAsync();
        }

        public void Update(Department menuItem)
        {
            // We don't need to do anything here
        }
    }
}
