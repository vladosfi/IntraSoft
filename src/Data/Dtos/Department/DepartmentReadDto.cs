namespace IntraSoft.Data.Dtos.Department
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;

    public class DepartmentReadDto : IMapFrom<Department>
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}
