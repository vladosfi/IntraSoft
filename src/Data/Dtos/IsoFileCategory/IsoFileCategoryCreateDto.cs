namespace IntraSoft.Data.Dtos.IsoCategory
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using System.ComponentModel.DataAnnotations;

    public class IsoFileCategoryCreateDto : IMapTo<IsoFileCategory>
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
