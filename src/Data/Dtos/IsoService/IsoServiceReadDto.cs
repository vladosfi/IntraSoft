namespace IntraSoft.Data.Dtos.IsoService
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using src.Data.Dtos.IsoFile;
    using System.Collections.Generic;

    public class IsoServiceReadDto : IMapFrom<IsoService>, IMapTo<IsoService>
    {
        public IsoServiceReadDto(){
            this.IsoFiles = new HashSet<IsoFileReadDto>();
        }

        public int Id { get; set; }
        
        public string Name { get; set; }

        public string Number { get; set; }

        //AutoGet From Automapper
        public int DepartmentId { get; set; }

        //AutoGet From Automapper
        public string DepartmentName { get; set; }

        public virtual ICollection<IsoFileReadDto> IsoFiles { get; set; }
    }
}
