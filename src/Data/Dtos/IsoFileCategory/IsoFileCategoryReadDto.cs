namespace IntraSoft.Data.Dtos.IsoCategory
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;

    public class IsoFileCategoryReadDto : IMapFrom<IsoFileCategory>
    {
        public int Id { get; set; }
        
        public string Name { get; set; }
    }
}
