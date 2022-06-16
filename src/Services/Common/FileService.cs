namespace IntraSoft.Services.Common
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;

    public static class FileService
    {
        private const string
            DIRECTORY_DOES_NOT_EXIST = "Directory does not exist!";

        private const string FILE_NAME_EXIST = "File with the same name and path already exist!";

        // Delete form filesystem
        public static void Delete(string webRootPath, string filePath)
        {
            // Delete form filesystem
            string path = Path.Combine(webRootPath, filePath);

            FileInfo file = new FileInfo(path);
            if (file.Exists)
            {
                file.Delete();
            }
        }

        //Create file
        public static async Task<string>
        CreateAsync(
            IFormFile file,
            string filePath,
            string fileName = null
        )
        {
            var fullPath = Path.GetFullPath(filePath);
            filePath = fullPath.Substring(fullPath.Length - filePath.Length);

            if (fileName != null)
            {
                fileName = fileName + Path.GetExtension(file.FileName);
            }
            else
            {
                // Generate unique file name if uniqueFileName is empty
                fileName = StringOperations.GetUniqueFileName(file.FileName);
            }

            // Throw error if directory does not exist
            if (!Directory.Exists(filePath))
            {
                throw new Exception(DIRECTORY_DOES_NOT_EXIST);
            }

            var filePathWithFileName = Path.Combine(filePath, fileName);

            // Throw error if file exist
            if (File.Exists(filePathWithFileName))
            {
                throw new Exception(FILE_NAME_EXIST);
            }

            var fs = new FileStream(filePathWithFileName, FileMode.Create);
            await file.CopyToAsync(fs);
            await fs.DisposeAsync();

            return filePathWithFileName;
        }

        //Get file extension
        public static string GetFileExtension(string path)
        {
            return Path.GetExtension(path).ToLowerInvariant();
        }

        // Combine file path
        public static string PathCombine(string pathOne, string pathTwo)
        {
            return Path.Combine(pathOne, pathTwo);
        }

        // Check if file exist
        public static bool FileExists(string fullPath)
        {
            return File.Exists(fullPath);
        }

        // Read file
        public static async Task<MemoryStream> ReadFileAsync(string path)
        {
            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            return memory;
        }

        // Get file extension
        public static string GetFileName(string path)
        {
            return Path.GetFileName(path);
        }

        // Move the file.
        public static void MoveFile(string srcPath, string destPath)
        {            
            File.Move(srcPath, destPath);
        }
    }
}