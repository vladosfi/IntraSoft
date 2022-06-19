namespace IntraSoft.Services.Data.Contact
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Repositories;
    using IntraSoft.Data.Dtos.Contact;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.EntityFrameworkCore;

    public class ContactService : IContactService
    {
        private readonly IDeletableEntityRepository<Contact> contactRepo;

        public ContactService(IDeletableEntityRepository<Contact> contactRepo)
        {
            this.contactRepo = contactRepo;
        }

        public async Task<int> CreateAsync(Contact contactItem)
        {
            await this.contactRepo.AddAsync(contactItem);
            await this.contactRepo.SaveChangesAsync();
            return contactItem.Id;
        }


        public async Task<IEnumerable<T>> GetAllForExportAsync<T>()
        {
            IQueryable<Contact> query =
                this.contactRepo
                .All()
                .Select(c => new Contact()
                {
                    FirstName = c.FirstName,
                    MiddleName = c.MiddleName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Phone = c.Phone,
                    DepartmentId = c.DepartmentId,
                    Department = c.Department,
                })
                .OrderBy(x => x.DepartmentId)
                .AsNoTracking()
                .AsSplitQuery();

            return await query.To<T>().ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsync<T>()
        {
            IQueryable<Contact> query =
                this.contactRepo
                .All()
                .Select(c => new Contact()
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    MiddleName = c.MiddleName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Phone = c.Phone,
                    DepartmentId = c.DepartmentId,
                })
                .OrderBy(x => x.DepartmentId)
                .ThenBy(x => x.Id)
                .AsNoTracking()
                .AsSplitQuery();

            return await query.To<T>().ToListAsync();
        }

        public async Task<T> GetByIdAsync<T>(int id)
        {
            return await this
                .contactRepo
                .All()
                .Where(x => x.Id == id)
                .To<T>()
                .FirstOrDefaultAsync();
        }

        // No need to map
        public async Task<Contact> GetByIdAsync(int id)
        {
            return await this
                .contactRepo
                .All()
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();
        }

        public void Delete(Contact contactItem)
        {
            this.contactRepo.Delete(contactItem);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await this.contactRepo.SaveChangesAsync();
        }

        public void Update(Contact contactItem)
        {
            // We don't need to do anything here
        }
    }
}
