namespace IntraSoft.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Services.Mapping;

    [Table("StateNewspapers")]
    public class StateNewspaper : BaseDeletableModel<int>, IMapFrom<Contact>
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
