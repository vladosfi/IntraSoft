namespace src.Data.Dtos.Department
{
    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;

    public class DepartmentDropDownReadDto : IMapFrom<Department>, IMapTo<Department>
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}