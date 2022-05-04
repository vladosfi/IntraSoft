namespace IntraSoft.Data.Dtos.Department
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using System.Collections.Generic;
    using IntraSoft.Data.Dtos.IsoService;

    public class DepartmentWithIsoServicesReadDto : IMapFrom<Department>, IMapTo<Department>
    {
        DepartmentWithIsoServicesReadDto(){
            this.IsoServices = new HashSet<IsoServiceReadDto>();
        }
        
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public virtual ICollection<IsoServiceReadDto> IsoServices { get; set; }
    }
}
