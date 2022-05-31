namespace IntraSoft.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;

    [Table("OrderCategories")]
    public class OrderCategory : BaseDeletableModel<int>
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public int OrderId { get; set; }

        public Order Order { get; set; }
    }
}
