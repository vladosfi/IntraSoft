namespace IntraSoft.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net;
    using System.Net.Http;
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Document;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class DocumentController : ControllerBase
    {
        private readonly IWebHostEnvironment hostingEnvironment;
        private const string directoryNotExist = "Directory does not exist!";

        private readonly IDocumentService documentService;

        public DocumentController(
            IWebHostEnvironment hostingEnvironment,
            IDocumentService documentService
        )
        {
            this.hostingEnvironment = hostingEnvironment;
            this.documentService = documentService;
        }

         [HttpGet("{id}", Name = nameof(GetDocument))]
        public async Task<IActionResult> GetDocument(int id)
        {
            //To do check for recor in database
            var document = await this.documentService.GetByIdAsync(id);
            if(document.FilePath == null) return this.NotFound();
            //documentId = "menu.xlsx";

            var path = Path.Combine(hostingEnvironment.WebRootPath, document.FilePath.ToString());
            //var path = Path.Combine(path, document);

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
        public async Task<IActionResult>
        AddDocument([FromForm] DocumentCreateModelDto fileInput)
        {
            if (fileInput.File != null && fileInput.Path != null)
            {
                var fullPath = Path.GetFullPath(fileInput.Path);
                fileInput.Path = fullPath.Substring(fullPath.Length - fileInput.Path.Length);

                // Save uniqueFileName to file system
                var uniqueFileName = GetUniqueFileName(fileInput.File.FileName);
                var uploads = Path.Combine(hostingEnvironment.WebRootPath, fileInput.Path);

                // Create dir if does not exidt
                if (!Directory.Exists(uploads))
                {
                    throw new Exception(directoryNotExist);
                }

                var filePath = Path.Combine(uploads, uniqueFileName);

                var fs = new FileStream(filePath, FileMode.Create);
                await fileInput.File.CopyToAsync(fs);
                await fs.DisposeAsync();

                // Save uniqueFileName to db table
                filePath = Path.Combine(fileInput.Path, uniqueFileName);
                var document =
                    new Document {
                        FilePath = filePath,
                        Description = null,
                        UserName = null,
                        MenuId = fileInput.MenuId,
                    };

                var documentId = await this.documentService.CreateAsync(document);

                return this.Ok(documentId);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var documentFromRepo = await this.documentService.GetByIdAsync(id);

            if (documentFromRepo == null)
            {
                return this.NotFound();
            }

            this.documentService.HardDelete(documentFromRepo);
            await this.documentService.SaveChangesAsync();

            // Delete form filesystem
            string path =
                Path
                    .Combine(hostingEnvironment.WebRootPath,
                    documentFromRepo.FilePath);

            FileInfo file = new FileInfo(path);
            if (file.Exists)
            {
                file.Delete();
            }

            return this.NoContent();
        }

        private string GetUniqueFileName(string fileName)
        {
            fileName = Path.GetFileName(fileName);
            return Path.GetFileNameWithoutExtension(fileName) +
            "_" +
            Guid.NewGuid().ToString().Substring(0, 10) +
            Path.GetExtension(fileName);
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string> {
                { ".txt", "text/plain" },
                { ".pdf", "application/pdf" },
                { ".doc", "application/vnd.ms-word" },
                { ".docx", "application/vnd.ms-word" },
                { ".xls", "application/vnd.ms-excel" },
                {
                    ".xlsx",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                },
                { ".png", "image/png" },
                { ".jpg", "image/jpeg" },
                { ".jpeg", "image/jpeg" },
                { ".gif", "image/gif" },
                { ".csv", "text/csv" }
            };
        }
    }
}
