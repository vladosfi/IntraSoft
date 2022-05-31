namespace IntraSoft.Data.Dtos.OrderCategory
{
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class OrderCategoryReadDto : IMapFrom<OrderCategory>
    {
        public string Name { get; set; }
    }
}
