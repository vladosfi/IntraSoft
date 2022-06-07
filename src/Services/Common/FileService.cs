namespace IntraSoft.Services.Common
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Document;

    public static class FileService
    {
        private const string directoryDoesNotExist = "Directory does not exist!";

        // Delete form filesystem
        public static void Delete(string path)
        {
            FileInfo file = new FileInfo(path);
            if (file.Exists)
            {
                file.Delete();
            }
        }

        //Create file
        public static async Task<string> CreateAsync(
            DocumentCreateModelDto fileInput,
            string webRootPath
        )
        {
            var fullPath = Path.GetFullPath(fileInput.Path);
            fileInput.Path =
                fullPath.Substring(fullPath.Length - fileInput.Path.Length);

            // Save uniqueFileName to file system
            var uniqueFileName =
                StringOperations.GetUniqueFileName(fileInput.File.FileName);
            var uploads =
                Path.Combine(webRootPath, fileInput.Path);

            // Throw error if directory does not exist
            if (!Directory.Exists(uploads))
            {
                throw new Exception(directoryDoesNotExist);
            }

            var filePathWithFileName = Path.Combine(uploads, uniqueFileName);

            var fs = new FileStream(filePathWithFileName, FileMode.Create);
            await fileInput.File.CopyToAsync(fs);
            await fs.DisposeAsync();

            return Path.Combine(fileInput.Path, uniqueFileName);
        }
    }
}
