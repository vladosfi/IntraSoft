namespace IntraSoft.Data.Dtos.OrderCategory
{
    using System.Collections.Generic;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class OrderCategoryReadDto : IMapFrom<OrderCategory>
    {
        // public OrderCategoryReadDto()
        // {
        //     this.Orders = new HashSet<Order>();
        // }
        
        public int Id { get; set; }

        public string Name { get; set; }

        //public virtual ICollection<Order> Orders { get; set; }
    }
}
