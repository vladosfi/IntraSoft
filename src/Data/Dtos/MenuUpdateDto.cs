namespace IntraSoft.Data.Dtos
{
    using System.ComponentModel.DataAnnotations;

    public class MenuUpdateDto
    {
        public int? ParentId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required]
        [MaxLength(250)]
        public string Action { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }
    }
}
