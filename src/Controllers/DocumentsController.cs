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
        private readonly string webRootPath;

        public DocumentsController(
            IWebHostEnvironment hostingEnvironment,
            IDocumentService documentService
        )
        {
            this.hostingEnvironment = hostingEnvironment;
            this.documentService = documentService;
            webRootPath = hostingEnvironment.WebRootPath;
        }

        [HttpGet("{id}/{open:bool?}", Name = nameof(GetDocument))]
        public async Task<IActionResult> GetDocument(int id, bool? open = false)
        {
            //To do check for record in database
            var document = await this.documentService.GetByIdAsync(id);
            if (document == null) return this.NotFound();

            var fullPath = FileService.PathCombine(webRootPath, document.FilePath.ToString());            
            if (!FileService.FileExists(fullPath)) return this.NotFound();

            var readedFile = await FileService.ReadFileAsync(fullPath);
            var fileName = FileService.GetFileName(fullPath);
            var ext = FileService.GetFileExtensionFromPath(fullPath);

            // To download or open file 
            if (open == true)
            {
                Response.Headers.Add("Content-Disposition", "inline; filename=" + fileName);
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

            fileInput.Path = FileService.PathCombine(webRootPath, MAIN_MENU_DIRECTORY);
            // Generate unique file name if uniqueFileName is empty
            var fileNameWithExt = StringOperations.GetUniqueFileName(fileInput.File.FileName);
            var fullPath = FileService.PathCombine(fileInput.Path, fileNameWithExt);
            await FileService.CreateAsync(fileInput.File, fullPath);
            var filePath = FileService.PathCombine(MAIN_MENU_DIRECTORY, fileNameWithExt);

            // Save uniqueFileName to db table
            var document =
                new Document
                {
                    FilePath = filePath,
                    UserName = null,
                    MenuId = fileInput.Id,
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
            FileService.Delete(webRootPath, documentFromRepo.FilePath);

            return this.NoContent();
        }
    }
}
