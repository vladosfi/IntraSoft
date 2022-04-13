namespace IntraSoft.Data.Dtos.Document
{
    using Microsoft.AspNetCore.Http;
    using System;
    using System.ComponentModel.DataAnnotations;

    public class Document
    {
        public Document()
        {
            DateAdded = DateTime.UtcNow;
        }

        public string FileName { get; set; }

        public string FilePath { get; set; }

        [Required]
        public IFormFile DataFile { get; set; }

        public string Description { get; set; }

        public DateTime DateAdded { get; set; }
    }
}
