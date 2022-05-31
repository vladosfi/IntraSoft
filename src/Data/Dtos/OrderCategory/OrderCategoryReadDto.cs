namespace IntraSoft.Data.Dtos.OrderCategory
{
    using System;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class OrderCategoryReadDto : IMapFrom<OrderCategory>
    {
        public string Name { get; set; }
    }
}
