using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Security;
using IntraSoft.Services.Data.Contact;
using IntraSoft.Data.Dtos.Contact;
using OfficeOpenXml.Style;
using System.Drawing;

namespace IntraSoft.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ExportController : ControllerBase
    {
        private readonly IWebHostEnvironment env;
        private readonly IContactService contactService;


        public ExportController(
            IContactService contactService,
            IWebHostEnvironment env)
        {
            this.contactService = contactService;
            this.env = env;
        }

        public async Task<IActionResult> File()
        {
            if (!this.env.IsDevelopment()) throw new SecurityException("Not allowed");


            // var file = Path.Combine(this.env.ContentRootPath, "Data/Source/data.xlsx");
            // using var stream = System.IO.File.OpenRead(file);

            var importedContacts = await this.ExportContacts();

            return importedContacts;
        }

        private async Task<IActionResult> ExportContacts()
        {
            //using var excelPackage = new ExcelPackage();

            var contactsFromRepo = await this.contactService.GetAllForExportAsync<ContactExportDto>();

            using (var workbook = new ExcelPackage())
            {
                string headerRange = "A1:D1";
                var contactWorksheet = workbook.Workbook.Worksheets.Add("Контакти");
                contactWorksheet.Cells[1, 1].Value = "Име";
                contactWorksheet.Cells[1, 2].Value = "Телефон";
                contactWorksheet.Cells[1, 3].Value = "Е-маил";
                contactWorksheet.Cells[1, 4].Value = "Дирекция";
                contactWorksheet.Cells[2, 1].LoadFromCollection(contactsFromRepo, false);
                contactWorksheet.DefaultColWidth = 20;

            contactWorksheet.Cells[headerRange].Style.Font.Bold = true;
            contactWorksheet.Cells[headerRange].Style.Font.Size = 14;
            contactWorksheet.Cells[headerRange].Style.Fill.PatternType = ExcelFillStyle.Solid;
            contactWorksheet.Cells[headerRange].Style.Fill.BackgroundColor.SetColor(Color.WhiteSmoke);
            contactWorksheet.Cells[headerRange].Style.Font.Color.SetColor(Color.Black);
            contactWorksheet.Cells[headerRange].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            contactWorksheet.Cells[headerRange].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

            contactWorksheet.Cells[contactWorksheet.Dimension.Address].Style.Border.Top.Style = ExcelBorderStyle.Thin;
            contactWorksheet.Cells[contactWorksheet.Dimension.Address].Style.Border.Left.Style = ExcelBorderStyle.Thin;
            contactWorksheet.Cells[contactWorksheet.Dimension.Address].Style.Border.Right.Style = ExcelBorderStyle.Thin;
            contactWorksheet.Cells[contactWorksheet.Dimension.Address].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

            contactWorksheet.Cells[headerRange].Style.Border.Top.Style = ExcelBorderStyle.Thick;
            contactWorksheet.Cells[headerRange].Style.Border.Left.Style = ExcelBorderStyle.Thick;
            contactWorksheet.Cells[headerRange].Style.Border.Right.Style = ExcelBorderStyle.Thick;
            contactWorksheet.Cells[headerRange].Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
            //contactWorksheet.Cells[headerRange].Style.Border.BorderAround(ExcelBorderStyle.Thick);


                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Контакти.xlsx");
                }
            }
        }
    }
}