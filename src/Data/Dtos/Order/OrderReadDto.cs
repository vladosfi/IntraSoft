namespace IntraSoft.Data.Dtos.Order
{
    using System;
    using System.IO;
    using IntraSoft.Data.Dtos.OrderCategory;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class OrderReadDto : IMapFrom<Order>
    {
        public int Id { get; set; }

        public string Number { get; set; }

        public DateTime Date { get; set; }

        public string About { get; set; }

        public string FilePath { get; set; }

        public string FileName => Path.GetFileName(this.FilePath);

        public virtual OrderCategoryReadDto OrderCategory { get; set; }
    }
}
