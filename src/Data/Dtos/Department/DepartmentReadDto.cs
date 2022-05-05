namespace IntraSoft.Data.Dtos.Department
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using System.Collections.Generic;
    using IntraSoft.Data.Dtos.IsoService;

    public class DepartmentReadDto : IMapFrom<Department>, IMapTo<Department>
    {
        public DepartmentReadDto(){
            this.IsoServices = new HashSet<IsoServiceReadDto>();
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public virtual ICollection<IsoServiceReadDto> IsoServices { get; set; }        
    }
}
