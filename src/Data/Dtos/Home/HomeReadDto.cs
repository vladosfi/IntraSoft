namespace IntraSoft.Data.Dtos.Home
{
    using System.Collections.Generic;

    public class HomeReadDto
    {
        public HomeReadDto()
        {
            this.Orders = new HashSet<HomeOrdersReadDto>();
            this.IsoServices = new HashSet<HomeIsoServicesReadDto>();
        }

        public virtual IEnumerable<HomeOrdersReadDto> Orders { get; set; }
        public virtual IEnumerable<HomeIsoServicesReadDto> IsoServices { get; set; }
    }
}
