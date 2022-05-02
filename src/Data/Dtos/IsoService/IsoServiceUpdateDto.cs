namespace IntraSoft.Data.Dtos.IsoService
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using System.ComponentModel.DataAnnotations;

    public class IsoServiceUpdateDto : IMapFrom<IsoService>, IMapTo<IsoService>
    {
        [Required]
        [MinLength(5)]
        [MaxLength(250)]
        public string Name { get; set; }

        [Required]
        [MinLength(2)]
        [MaxLength(20)]
        public string Number { get; set; }

        [Required]
        public int DepartmentId { get; set; }
    }
}
