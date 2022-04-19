namespace IntraSoft.Data.Dtos.Department
{
    using System.ComponentModel.DataAnnotations;

    public class DepartmentUpdateDto
    {
        [Required]
        [MaxLength(100)]
        [MinLength(2)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }
    }
}
