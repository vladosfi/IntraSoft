namespace IntraSoft.Controllers
{
    using System.IO;
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Document;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Common;
    using IntraSoft.Services.Data;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly IWebHostEnvironment hostingEnvironment;

        private readonly IDocumentService documentService;

        private const string MAIN_MENU_DIRECTORY = "uploads\\menu";

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
            //To do check for record in database
            var document = await this.documentService.GetByIdAsync(id);
            if (document == null) return this.NotFound();

            var fullPath = FileService.PathCombine(hostingEnvironment.WebRootPath, document.FilePath.ToString());            
            if (!FileService.FileExists(fullPath)) return this.NotFound();

            var readedFile = await FileService.ReadFileAsync(fullPath);
            var fileName = FileService.GetFileName(fullPath);
            var ext = FileService.GetFileExtension(fullPath);

            // To download or open file 
            if (open == true)
            {
                Response.Headers.Add("Content-Disposition", "inline; filename=" + Path.GetFileName(fullPath));
                return new PhysicalFileResult(fullPath, StringOperations.GetMimeTypes()[ext]);
            }
            else
            {
                return File(readedFile, StringOperations.GetMimeTypes()[ext], fileName);
            }
        }

        [HttpPost]
        public async Task<IActionResult>
        AddDocument([FromForm] DocumentCreateModelDto fileInput)
        {
            if (fileInput.File == null)
            {
                return BadRequest();
            }

            fileInput.Path = MAIN_MENU_DIRECTORY;
            var filePathWithFileName = await FileService.CreateAsync(fileInput.Path, fileInput.File, hostingEnvironment.WebRootPath);
 
            // Save uniqueFileName to db table
            var document =
                new Document
                {
                    FilePath = filePathWithFileName,
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
            FileService.Delete(hostingEnvironment.WebRootPath, documentFromRepo.FilePath);

            return this.NoContent();
        }
    }
}
