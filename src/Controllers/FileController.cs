namespace IntraSoft.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Document;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IWebHostEnvironment hostingEnvironment;

        public FileController(IWebHostEnvironment hostingEnvironment)
        {
            this.hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public async Task<IActionResult> Download(string DocumentPath)
        {
            //To do check for recor in database 
            //if(path == null) return this.NotFound();
            DocumentPath = "menu.xlsx";

            var uploadPath = Path.Combine(hostingEnvironment.WebRootPath, "uploads");
            var path = Path.Combine(uploadPath, DocumentPath);


            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return File(memory, GetMimeTypes()[ext], Path.GetFileName(path));
        }



        [HttpPost]
        public async Task<IActionResult> AddFile([FromForm] DocumentInputModelDto fileInput)
        {
            if (fileInput.DataFile != null)
            {
                var uniqueFileName = GetUniqueFileName(fileInput.DataFile.FileName);
                var uploads = Path.Combine(hostingEnvironment.WebRootPath, "uploads");
                var filePath = Path.Combine(uploads, uniqueFileName);
                await fileInput.DataFile.CopyToAsync(new FileStream(filePath, FileMode.Create));

                //to do : Save uniqueFileName to db table   
            }

            // to do  : Return something
            return this.Ok();
        }


        private string GetUniqueFileName(string fileName)
        {
            fileName = Path.GetFileName(fileName);
            return Path.GetFileNameWithoutExtension(fileName)
                      + "_"
                      + Guid.NewGuid().ToString().Substring(0, 10)
                      + Path.GetExtension(fileName);
        }


        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
    }
}