namespace IntraSoft.Data.Dtos.Home
{
    using System;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class HomeOrdersReadDto : IMapFrom<Order>
    {
        public int Id { get; set; }

        public string Number { get; set; }

        public DateTime Date { get; set; }

        public string About { get; set; }
    }
}
