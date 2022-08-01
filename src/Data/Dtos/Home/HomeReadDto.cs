namespace IntraSoft.Data.Dtos.Home
{
    using System.Collections.Generic;
    using IntraSoft.Data.Dtos.StateNewspaper;
    using IntraSoft.Services.Mapping;

    public class HomeReadDto : IMapFrom<IntraSoft.Data.Models.Home>
    {
        public HomeReadDto()
        {
            this.Orders = new HashSet<HomeOrdersReadDto>();
            this.IsoServices = new HashSet<HomeIsoServicesReadDto>();
            this.StateNewspapers = new HashSet<StateNewspaperReadDto>();
        }

        public int Id { get; set; }
        
        public string Content { get; set; }

        public virtual IEnumerable<HomeOrdersReadDto> Orders { get; set; }

        public virtual IEnumerable<HomeIsoServicesReadDto> IsoServices { get; set; }

        public virtual IEnumerable<StateNewspaperReadDto> StateNewspapers { get; set; }
    }
}
