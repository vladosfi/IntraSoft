namespace IntraSoft.Data.Dtos.Document
{
    using Microsoft.AspNetCore.Http;
    using System.ComponentModel.DataAnnotations;

    public class DocumentCreateModelDto
    {
        [Required]
        public IFormFile File { get; set; }

        public string Path { get; set; }
        
        [Required]
        public int MenuId { get; set; }
    }
}


