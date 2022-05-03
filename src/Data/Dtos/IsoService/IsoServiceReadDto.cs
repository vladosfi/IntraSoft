namespace IntraSoft.Data.Dtos.IsoService
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using src.Data.Dtos.IsoFile;
    using IntraSoft.Data.Dtos.Department;

    public class IsoServiceReadDto : IMapFrom<IsoService>, IMapTo<IsoService>
    {
        public int Id { get; set; }
        
        public string Name { get; set; }

        public string Number { get; set; }

        public int DepartmentId { get; set; }

        public virtual IsoFileReadDto Document { get; set; }
        public virtual DepartmentReadDto Departments { get; set; }
    }
}
