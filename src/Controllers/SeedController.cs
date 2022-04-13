using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Security;
using IntraSoft.Data;
using AutoMapper;
using IntraSoft.Data.Models;

namespace IntraSoft.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly IWebHostEnvironment env;
        private readonly IMenuAPIRepo repo;
        private readonly IMapper mapper;

        public SeedController(IMenuAPIRepo repo, IMapper mapper, IWebHostEnvironment env)
        {
            this.repo = repo;
            this.mapper = mapper;
            this.env = env;
        }

        public async Task<IActionResult> ImportMenu()
        {
            if (!this.env.IsDevelopment()) throw new SecurityException("Not allowed");

            var path = Path.Combine(this.env.ContentRootPath, "Data/Source/menu.xlsx");

            using var stream = System.IO.File.OpenRead(path);
            using var excelPackage = new ExcelPackage(stream);
            // get the first worksheet
            var worksheet = excelPackage.Workbook.Worksheets[0];
            // define how many rows we want to process
            var nEndRow = worksheet.Dimension.End.Row;
            // initialize the record menus
            var numberOfMenusAdded = 0;

            // create a lookup dictionary
            // containing all the menu already existing
            // into the Database (it will be empty on first run).
            var existingMenus = await this.repo.GetAllAsync();
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
                await this.repo.CreateAsync(menuToAdd);
                // store the country in our lookup to retrieve its Id later on
                menuByText.Add(menuText, menuToAdd);
                // increment the counter
                numberOfMenusAdded++;
            }

            if (numberOfMenusAdded > 0) await this.repo.SaveChangesAsync();


            return new JsonResult(new
            {
                MenuCreateDto = menuByText
            });
        }
    }
}