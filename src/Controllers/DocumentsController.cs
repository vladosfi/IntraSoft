namespace IntraSoft.Controllers
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using IntraSoft.Data.Common.Services;
    using IntraSoft.Data.Dtos.Document;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly IWebHostEnvironment hostingEnvironment;
        private const string directoryDoesNotExist = "Directory does not exist!";

        private readonly IDocumentService documentService;

        public DocumentsController(
            IWebHostEnvironment hostingEnvironment,
            IDocumentService documentService
        )
        {
            this.hostingEnvironment = hostingEnvironment;
            this.documentService = documentService;
        }

        [HttpGet("{id}/{open:bool?}", Name = nameof(GetDocument))]
        public async Task<IActionResult> GetDocument(int id, bool? open = false)
        {
            //To do check for recor in database
            var document = await this.documentService.GetByIdAsync(id);
            if (document == null || document.FilePath == null) return this.NotFound();

            var fullPath = Path.Combine(hostingEnvironment.WebRootPath, document.FilePath.ToString());
            if (!System.IO.File.Exists(fullPath)) return this.NotFound();

            var memory = new MemoryStream();
            using (var stream = new FileStream(fullPath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            var ext = Path.GetExtension(fullPath).ToLowerInvariant();

            // To download or open file 
            if (open == true)
            {
                Response.Headers.Add("Content-Disposition", "inline; filename=" + Path.GetFileName(fullPath));
                return new PhysicalFileResult(fullPath, StringOperations.GetMimeTypes()[ext]);
            }
            else
            {
                return File(memory, StringOperations.GetMimeTypes()[ext], Path.GetFileName(fullPath));
            }
        }

        [HttpPost]
        public async Task<IActionResult>
        AddDocument([FromForm] DocumentCreateModelDto fileInput)
        {
            if (fileInput.File == null && fileInput.Path == null)
            {
                return BadRequest();
            }

            var fullPath = Path.GetFullPath(fileInput.Path);
            fileInput.Path = fullPath.Substring(fullPath.Length - fileInput.Path.Length);

            // Save uniqueFileName to file system
            var uniqueFileName = StringOperations.GetUniqueFileName(fileInput.File.FileName);
            var uploads = Path.Combine(hostingEnvironment.WebRootPath, fileInput.Path);

            // Create dir if does not exidt
            if (!Directory.Exists(uploads))
            {
                throw new Exception(directoryDoesNotExist);
            }

            var filePathWithFileName = Path.Combine(uploads, uniqueFileName);

            var fs = new FileStream(filePathWithFileName, FileMode.Create);
            await fileInput.File.CopyToAsync(fs);
            await fs.DisposeAsync();

            // Save uniqueFileName to db table
            filePathWithFileName = Path.Combine(fileInput.Path, uniqueFileName);
            var document =
                new Document
                {
                    FilePath = filePathWithFileName,
                    Description = null,
                    UserName = null,
                    MenuId = fileInput.MenuId,
                };

            var documentId = await this.documentService.CreateAsync(document);

            return this.Ok(documentId);
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
            string path = Path.Combine(hostingEnvironment.WebRootPath, documentFromRepo.FilePath);

            FileInfo file = new FileInfo(path);
            if (file.Exists)
            {
                file.Delete();
            }

            return this.NoContent();
        }
    }
}
