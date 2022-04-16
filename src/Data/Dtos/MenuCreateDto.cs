namespace IntraSoft.Data.Dtos
{
    using System.ComponentModel.DataAnnotations;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class MenuCreateDto: IMapFrom<Menu>, IMapTo<Menu>
    {
        public int? ParentId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Text { get; set; }

        [MaxLength(200)]
        public string Icon { get; set; }

        [Required]
        [MaxLength(250)]
        public string RouterLink { get; set; }
    }
}