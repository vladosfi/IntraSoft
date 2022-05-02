namespace IntraSoft.Data.Dtos.Department
{
    using System.ComponentModel.DataAnnotations;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class DepartmentCreateDto: IMapFrom<Department>, IMapTo<Department>
    {
        [Required]
        [MaxLength(100)]
        [MinLength(2)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }
    }
}