namespace IntraSoft.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;

    [Table("Documents")]
    public class Document : BaseDeletableModel<int>
    {
        [Required]
        [MaxLength(250)]
        public string FilePath { get; set; }

        [MaxLength(50)]
        public string UserName { get; set; }

        public int? MenuId { get; set; }

        public virtual Menu Menu { get; set; }
    }
}
