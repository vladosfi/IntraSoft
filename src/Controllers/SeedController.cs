using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Security;
using IntraSoft.Data.Models;
using IntraSoft.Services.Data;
using IntraSoft.Services.Data.Contact;
using IntraSoft.Services.Data.Order;
using IntraSoft.Services.Data.OrderCategory;
using IntraSoft.Services.Data.Menu;

namespace IntraSoft.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly IWebHostEnvironment env;
        private readonly IMenuService menuService;
        private readonly IDepartmentService departmentService;
        private readonly IContactService contactService;
        private readonly IIsoService isoService;
        private readonly IIsoFileCategoryService isoFileCategoryService;
        private readonly IOrderCategoryService orderCategoryService;
        private readonly IOrderService orderService;

        public SeedController(
            IMenuService menuService, 
            IDepartmentService departmentService,
            IContactService contactService,
            IIsoService isoService,
            IIsoFileCategoryService isoFileCategoryService,
            IOrderCategoryService orderCategoryService,
            IOrderService orderService,
            IWebHostEnvironment env)
        {
            this.menuService = menuService;
            this.departmentService = departmentService;
            this.contactService = contactService;
            this.isoService = isoService;
            this.isoFileCategoryService = isoFileCategoryService;
            this.orderCategoryService = orderCategoryService;
            this.orderService = orderService;
            this.env = env;
        }

        public async Task<IActionResult> Import()
        {
            if (!this.env.IsDevelopment()) throw new SecurityException("Not allowed");


            var file = Path.Combine(this.env.ContentRootPath, "Data/Source/data.xlsx");
            using var stream = System.IO.File.OpenRead(file);
            using var excelPackage = new ExcelPackage(stream);

            var importedMenus = await this.ImportMenu(excelPackage);
            var importedDepartments = await this.ImportDepartments(excelPackage);
            var importedContacts = await this.ImportContacts(excelPackage);
            var importedIsoServices = await this.ImportIsoServices(excelPackage);
            var importedIsoFileCategories = await this.ImportIsoFileCategories(excelPackage);
            var importedOrderCategories = await this.ImportOrderCategories(excelPackage);
            var importedOrders = await this.ImportOrders(excelPackage);

            return new JsonResult(new
            {
                Menus = importedMenus,
                Departments = importedDepartments,
                Contacts = importedContacts,
                IsoServices = importedIsoServices,
                IsoFileCategories = importedIsoFileCategories,
                OrderCategories = importedOrderCategories,
                Orders = importedOrders,
            });
        }


        private async Task<IActionResult> ImportMenu(ExcelPackage excelPackage)
        {
            // get the first worksheet
            var worksheet = excelPackage.Workbook.Worksheets[0];
            // define how many rows we want to process
            var nEndRow = worksheet.Dimension.End.Row;
            // initialize the record menus
            var numberOfMenusAdded = 0;

            // create a lookup dictionary
            // containing all the menu already existing
            // into the Database (it will be empty on first run).
            var existingMenus = await this.menuService.GetAllAsync();
            var menuByText = existingMenus.ToDictionary(x => x.Text, StringComparer.OrdinalIgnoreCase);

            // iterates through all rows, skipping the first one
            for (int nRow = 2; nRow <= nEndRow; nRow++)
            {
                var row = worksheet.Cells[
                nRow, 2, nRow, worksheet.Dimension.End.Column];
                var menuText = row[nRow, 2].GetValue<string>();
                var icon = row[nRow, 3].GetValue<string>();
                var routerLink = row[nRow, 4].GetValue<string>();
                var parentId = row[nRow, 5].GetValue<int?>();

                // skip this country if it already exists in the database
                if (menuByText.ContainsKey(menuText)) continue;

                // create the Country entity and fill it with xlsx data
                var menuToAdd = new Menu
                {
                    Text = menuText,
                    Icon = icon,
                    RouterLink = routerLink,
                    ParentId = parentId,
                };

                // Add chiled menu to parent
                if(menuToAdd.ParentId != null)
                {
                    var parentMenu = existingMenus.FirstOrDefault(x => x.Id == menuToAdd.ParentId);

                    if (parentMenu != null)
                    {
                        parentMenu.Children.Add(menuToAdd);
                        continue;
                    }
                }

                // add the new country to the DB context
                await this.menuService.CreateAsync(menuToAdd);
                // store the country in our lookup to retrieve its Id later on
                menuByText.Add(menuText, menuToAdd);
                // increment the counter
                numberOfMenusAdded++;
            }

            //if (numberOfMenusAdded > 0) await this.menuService.SaveChangesAsync();

            return new JsonResult(new
            {
                MenuCreateDto = menuByText
            });
        }

        private async Task<IActionResult> ImportDepartments(ExcelPackage excelPackage)
        {
            // get the first worksheet
            var worksheet = excelPackage.Workbook.Worksheets[1];
            // define how many rows we want to process
            var nEndRow = worksheet.Dimension.End.Row;
            // initialize the record menus
            var numberOfDepartmentsAdded = 0;

            // create a lookup dictionary
            var existingDepartments = await this.departmentService.GetAllAsync<Department>();
            var departmetnsByName = existingDepartments.ToDictionary(x => x.Name, StringComparer.OrdinalIgnoreCase);

            // iterates through all rows, skipping the first one
            for (int nRow = 2; nRow <= nEndRow; nRow++)
            {
                var row = worksheet.Cells[
                nRow, 2, nRow, worksheet.Dimension.End.Column];
                var name = row[nRow, 2].GetValue<string>();
                var description = row[nRow, 3].GetValue<string>();

                // skip this country if it already exists in the database
                if (departmetnsByName.ContainsKey(name)) continue;

                // create the Country entity and fill it with xlsx data
                var departmentToAdd = new Department
                {
                    Name = name,
                    Description = description,
                };

                // add the new country to the DB context
                await this.departmentService.AddAsync(departmentToAdd);
                // store the country in our lookup to retrieve its Id later on
                departmetnsByName.Add(name, departmentToAdd);
                // increment the counter
                numberOfDepartmentsAdded++;
            }

            //if (numberOfDepartmentsAdded > 0) await this.departmentService.SaveChangesAsync();

            return new JsonResult(new
            {
                DepartmentReadDto = departmetnsByName
            });
        }

        private async Task<IActionResult> ImportContacts(ExcelPackage excelPackage)
        {
            // get the first worksheet
            var worksheet = excelPackage.Workbook.Worksheets[2];
            // define how many rows we want to process
            var nEndRow = worksheet.Dimension.End.Row;
            // initialize the record menus
            var numberOfContactsAdded = 0;

            // create a lookup dictionary
            var existingContacts = await this.contactService.GetAllAsync<Contact>();
            var contactsByEmailName = existingContacts.ToDictionary(x => x.Email, StringComparer.OrdinalIgnoreCase);

            // iterates through all rows, skipping the first one
            for (int nRow = 2; nRow <= nEndRow; nRow++)
            {
                var row = worksheet.Cells[
                nRow, 2, nRow, worksheet.Dimension.End.Column];
                var firstName = row[nRow, 2].GetValue<string>();
                var middleName = row[nRow, 3].GetValue<string>();
                var lastName = row[nRow, 4].GetValue<string>();
                var phone = row[nRow, 5].GetValue<string>();
                var email = row[nRow, 6].GetValue<string>();
                var departmentId = row[nRow, 7].GetValue<int>();


                // skip this country if it already exists in the database
                if (contactsByEmailName.ContainsKey(email)) continue;

                // create the Country entity and fill it with xlsx data
                var contactToAdd = new Contact
                {
                    FirstName = firstName,
                    MiddleName = middleName,
                    LastName = lastName,
                    Phone = phone,
                    Email = email,
                    DepartmentId = departmentId,                    
                };

                // add the new country to the DB context
                await this.contactService.CreateAsync(contactToAdd);
                // store the country in our lookup to retrieve its Id later on
                contactsByEmailName.Add(email, contactToAdd);
                // increment the counter
                numberOfContactsAdded++;
            }

            //if (numberOfContactsAdded > 0) await this.contactService.SaveChangesAsync();

            return new JsonResult(new
            {
                ContactsReadDto = contactsByEmailName
            });
        }

        private async Task<IActionResult> ImportIsoServices(ExcelPackage excelPackage)
        {
            // get the first worksheet
            var worksheet = excelPackage.Workbook.Worksheets[3];
            // define how many rows we want to process
            var nEndRow = worksheet.Dimension.End.Row;
            // initialize the record menus
            var numberOfIsoServicesAdded = 0;

            // create a lookup dictionary
            var existingIsoService = await this.isoService.GetAllAsync<Data.Models.IsoService>();
            var serviceByNumber = existingIsoService.ToDictionary(x => x.Number, StringComparer.OrdinalIgnoreCase);

            // iterates through all rows, skipping the first one
            for (int nRow = 2; nRow <= nEndRow; nRow++)
            {
                var row = worksheet.Cells[
                nRow, 2, nRow, worksheet.Dimension.End.Column];
                var name = row[nRow, 2].GetValue<string>();
                var number = row[nRow, 3].GetValue<string>();
                var departmentId = row[nRow, 4].GetValue<int>();


                // skip this country if it already exists in the database
                if (serviceByNumber.ContainsKey(number)) continue;

                // create the Country entity and fill it with xlsx data
                var isoServiceToAdd = new Data.Models.IsoService
                {
                    Name = name,
                    Number = number,
                    DepartmentId = departmentId,                    
                };

                // add the new country to the DB context
                await this.isoService.CreateAsync(isoServiceToAdd);
                // store the country in our lookup to retrieve its Id later on
                serviceByNumber.Add(number, isoServiceToAdd);
                // increment the counter
                numberOfIsoServicesAdded++;
            }

            return new JsonResult(new
            {
                IsoServicesReadDto = serviceByNumber
            });
        }
        
        private async Task<IActionResult> ImportIsoFileCategories(ExcelPackage excelPackage)
        {
            // get the first worksheet
            var worksheet = excelPackage.Workbook.Worksheets[4];
            // define how many rows we want to process
            var nEndRow = worksheet.Dimension.End.Row;
            // initialize the record menus
            var numberOfIsoFileCategoriesAdded = 0;

            // create a lookup dictionary
            var existingIsoFileCategories = await this.isoFileCategoryService.GetAllAsync<IsoFileCategory>();
            var serviceByName = existingIsoFileCategories.ToDictionary(x => x.Name, StringComparer.OrdinalIgnoreCase);

            // iterates through all rows, skipping the first one
            for (int nRow = 2; nRow <= nEndRow; nRow++)
            {
                var row = worksheet.Cells[
                nRow, 2, nRow, worksheet.Dimension.End.Column];
                var name = row[nRow, 2].GetValue<string>();
                var description = row[nRow, 3].GetValue<string>();

                // skip this country if it already exists in the database
                if (serviceByName.ContainsKey(name)) continue;

                // create the Country entity and fill it with xlsx data
                var IsoFileCategoryToAdd = new IsoFileCategory
                {
                    Name = name,
                    Description = description                 
                };

                // add the new country to the DB context
                await this.isoFileCategoryService.CreateAsync(IsoFileCategoryToAdd);
                // store the country in our lookup to retrieve its Id later on
                serviceByName.Add(name, IsoFileCategoryToAdd);
                // increment the counter
                numberOfIsoFileCategoriesAdded++;
            }

            return new JsonResult(new
            {
                IsoFileCategories = serviceByName
            });
        }


        private async Task<IActionResult> ImportOrderCategories(ExcelPackage excelPackage)
        {
            // get the first worksheet
            var worksheet = excelPackage.Workbook.Worksheets[5];
            // define how many rows we want to process
            var nEndRow = worksheet.Dimension.End.Row;
            // initialize the record menus
            var numberOfItemsAdded = 0;

            // create a lookup dictionary
            var existingItems = await this.orderCategoryService.GetAllAsync<OrderCategory>();
            var itemByName = existingItems.ToDictionary(x => x.Name, StringComparer.OrdinalIgnoreCase);

            // iterates through all rows, skipping the first one
            for (int nRow = 2; nRow <= nEndRow; nRow++)
            {
                var row = worksheet.Cells[
                nRow, 2, nRow, worksheet.Dimension.End.Column];
                var name = row[nRow, 2].GetValue<string>();

                // skip this country if it already exists in the database
                if (itemByName.ContainsKey(name)) continue;

                // create the Country entity and fill it with xlsx data
                var itemToAdd = new OrderCategory
                {
                    Name = name,      
                };

                // add the new country to the DB context
                await this.orderCategoryService.CreateAsync(itemToAdd);
                // store the country in our lookup to retrieve its Id later on
                itemByName.Add(name, itemToAdd);
                // increment the counter
                numberOfItemsAdded++;
            }

            return new JsonResult(new
            {
                OrderCategories = itemByName
            });
        }


    private async Task<IActionResult> ImportOrders(ExcelPackage excelPackage)
        {
            // get the first worksheet
            var worksheet = excelPackage.Workbook.Worksheets[6];
            // define how many rows we want to process
            var nEndRow = worksheet.Dimension.End.Row;
            // initialize the record menus
            var numberItemsAdded = 0;

            // create a lookup dictionary
            var existingItems = await this.orderService.GetAllAsync<Order>();
            var itemByNumber = existingItems.ToDictionary(x => x.Number, StringComparer.OrdinalIgnoreCase);

            // iterates through all rows, skipping the first one
            for (int nRow = 2; nRow <= nEndRow; nRow++)
            {
                var row = worksheet.Cells[
                nRow, 2, nRow, worksheet.Dimension.End.Column];
                var number = row[nRow, 2].GetValue<string>();
                var date = row[nRow, 3].GetValue<DateTime>();
                var about = row[nRow, 4].GetValue<string>();
                var filePath = row[nRow, 5].GetValue<string>();
                var orderCategoryId = row[nRow, 6].GetValue<int>();

                // skip this country if it already exists in the database
                if (itemByNumber.ContainsKey(number)) continue;

                // create the Country entity and fill it with xlsx data
                var itemToAdd = new Order
                {
                    Number = number,
                    Date = date,
                    About = about,
                    FilePath = filePath,
                    OrderCategoryId = orderCategoryId,
                };

                // add the new country to the DB context
                await this.orderService.CreateAsync(itemToAdd);
                // store the country in our lookup to retrieve its Id later on
                itemByNumber.Add(number, itemToAdd);
                // increment the counter
                numberItemsAdded++;
            }

            return new JsonResult(new
            {
                Orders = itemByNumber
            });
        }
        
    }
}