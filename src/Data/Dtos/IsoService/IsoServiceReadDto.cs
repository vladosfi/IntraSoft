namespace IntraSoft.Data.Dtos.IsoService
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;

    public class IsoServiceReadDto : IMapFrom<IsoService>, IMapTo<IsoService>
    {
        public int Id { get; set; }
        
        public string Name { get; set; }

        public string Number { get; set; }
        public int DepartmentId { get; set; }
    }
}
