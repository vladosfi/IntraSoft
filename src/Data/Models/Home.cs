namespace IntraSoft.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;

    [Table("Home")]
    public class Home : BaseDeletableModel<int>
    {
        [Required]
        public string Content { get; set; }
    }
}
