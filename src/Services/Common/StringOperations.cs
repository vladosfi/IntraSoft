namespace IntraSoft.Services.Common
{
    using System;
    using System.Collections.Generic;
    using System.IO;

    public static class StringOperations
    {
        public static string GetUniqueFileName(string fileName)
        {
            fileName = Path.GetFileName(fileName);

            return Path.GetFileNameWithoutExtension(fileName) +
            "_" +
            Guid.NewGuid().ToString().Substring(0, 5) +
            Path.GetExtension(fileName);
        }

        public static Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string> {
                { ".txt", "text/plain" },
                { ".pdf", "application/pdf" },
                { ".doc", "application/vnd.ms-word" },
                { ".docx", "application/vnd.ms-word" },
                { ".xls", "application/vnd.ms-excel" },
                { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
                { ".png", "image/png" },
                { ".jpg", "image/jpeg" },
                { ".jpeg", "image/jpeg" },
                { ".gif", "image/gif" },
                { ".csv", "text/csv" }
            };
        }
    }
}