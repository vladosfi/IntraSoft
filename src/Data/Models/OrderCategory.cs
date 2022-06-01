namespace IntraSoft.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Services.Mapping;

    [Table("OrderCategories")]
    public class OrderCategory : BaseDeletableModel<int>, IMapFrom<OrderCategory>
    {
        public OrderCategory()
        {
            this.Orders = new HashSet<Order>();
        }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
