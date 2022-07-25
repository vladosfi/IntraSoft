namespace IntraSoft.Data.Dtos.StateNewspaper
{
    using System.ComponentModel.DataAnnotations;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class StateNewspaperUpdateDto : IMapTo<StateNewspaper>
    {
        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [MaxLength(250)]
        public string Link { get; set; }
    }
}
