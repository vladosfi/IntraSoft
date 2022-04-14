namespace IntraSoft.Data.Dtos.Document
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using Microsoft.AspNetCore.Http;

    public class Document
    {
        public Document()
        {
            DateAdded = DateTime.UtcNow;
        }

        [Key]
        [Required]
        public int Id { get; set; }

        public string FileName { get; set; }

        public string FilePath { get; set; }

        public string Description { get; set; }

        public string UserName { get; set; }

        public DateTime DateAdded { get; set; }
    }
}
