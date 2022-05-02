namespace IntraSoft.Data.Dtos.IsoService
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using System.ComponentModel.DataAnnotations;

    public class IsoFileCategoryUpdateDto : IMapFrom<IsoFileCategory>, IMapTo<IsoFileCategory>
    {
        [Required]
        [MinLength(5)]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MinLength(2)]
        [MaxLength(250)]
        public string Description { get; set; }
    }
}
