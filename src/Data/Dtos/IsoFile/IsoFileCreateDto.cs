namespace src.Data.Dtos.IsoFile
{
    using System.ComponentModel.DataAnnotations;
    using Microsoft.AspNetCore.Http;

    public class IsoFileCreateDto
    {
        [Required]
        public IFormFile File { get; set; }

        [Required]
        [MaxLength(250)]
        public string Path { get; set; }

        [MaxLength(250)]
        public string Description { get; set; }

        [Required]
        public int IsoFileCategoryId { get; set; }

        [Required]
        public int IsoServicesId { get; set; }
    }
}
