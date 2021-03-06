namespace IntraSoft.Controllers
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Common;
    using IntraSoft.Services.Data;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;
    using src.Data.Dtos.IsoFile;

    [Route("api/[controller]")]
    [ApiController]
    public class IsoFilesController : ControllerBase
    {
        private readonly IWebHostEnvironment hostingEnvironment;
        private const string directoryDoesNotExist = "Directory does not exist!";

        private readonly IIsoFileService isoFileService;

        public IsoFilesController(
            IWebHostEnvironment hostingEnvironment,
            IIsoFileService isoFileService
        )
        {
            this.hostingEnvironment = hostingEnvironment;
            this.isoFileService = isoFileService;
        }

        [HttpGet("{id}/{open:bool?}", Name = nameof(GetIsoFile))]
        public async Task<IActionResult> GetIsoFile(int id, bool? open = false)
        {
            //To do check for recor in database
            var file = await this.isoFileService.GetByIdAsync(id);
            if (file == null || file.FilePath == null) return this.NotFound();

            var fullPath = FileService.PathCombine(hostingEnvironment.WebRootPath, file.FilePath.ToString());            
            if (!FileService.FileExists(fullPath)) return this.NotFound();

            var readedFile = await FileService.ReadFileAsync(fullPath);
            var fileName = FileService.GetFileName(fullPath);
            var ext = FileService.GetFileExtensionFromPath(fullPath);

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
        AddDocument([FromForm] IsoFileCreateDto fileInput)
        {
            if (fileInput.File == null && fileInput.Path == null)
            {
                return BadRequest();
            }

            var fullPath = System.IO.Path.GetFullPath(fileInput.Path);
            fileInput.Path = fullPath.Substring(fullPath.Length - fileInput.Path.Length);

            // Save uniqueFileName to file system            
            var uniqueFileName = StringOperations.GetUniqueFileName(fileInput.File.FileName);
            var uploads = System.IO.Path.Combine(hostingEnvironment.WebRootPath, fileInput.Path);

            // Create dir if does not exidt
            if (!Directory.Exists(uploads))
            {
                throw new Exception(directoryDoesNotExist);
            }

            var filePathWithFileName = System.IO.Path.Combine(uploads, uniqueFileName);

            var fs = new FileStream(filePathWithFileName, FileMode.Create);
            await fileInput.File.CopyToAsync(fs);
            await fs.DisposeAsync();

            // Save uniqueFileName to db table
            filePathWithFileName = System.IO.Path.Combine(fileInput.Path, uniqueFileName);
            var isoFile =
                new IsoFile
                {
                    FilePath = filePathWithFileName,
                    Description = fileInput.Description,
                    IsoCategoryId = fileInput.IsoFileCategoryId,
                    IsoServicesId = fileInput.IsoServicesId,
                };

            var fileId = await this.isoFileService.CreateAsync(isoFile);

            return this.Ok(fileId);

        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var isoFileFromRepo = await this.isoFileService.GetByIdAsync(id);

            if (isoFileFromRepo == null)
            {
                return this.NotFound();
            }

            this.isoFileService.HardDelete(isoFileFromRepo);
            await this.isoFileService.SaveChangesAsync();

            // Delete form filesystem
            FileService.Delete(hostingEnvironment.WebRootPath, isoFileFromRepo.FilePath);

            return this.NoContent();
        }
    }
}
