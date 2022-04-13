namespace IntraSoft.Data.Dtos.Document
{
    using Microsoft.AspNetCore.Http;
    using System;
    using System.ComponentModel.DataAnnotations;

    public class DocumentInputModelDto
    {
        [Required]
        public IFormFile DataFile { get; set; }

        public string Description { get; set; }
    }
}
