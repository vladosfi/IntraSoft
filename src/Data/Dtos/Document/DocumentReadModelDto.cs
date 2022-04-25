namespace IntraSoft.Data.Dtos.Document
{
    using Microsoft.AspNetCore.Http;
    using System;
    using System.ComponentModel.DataAnnotations;

    public class DocumentReadModelDto
    {
        [Required]
        public IFormFile File { get; set; }

        public string Description { get; set; }
    }
}
