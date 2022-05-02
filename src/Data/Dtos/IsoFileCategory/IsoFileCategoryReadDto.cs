namespace IntraSoft.Data.Dtos.IsoCategory
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;

    public class IsoFileCategoryReadDto : IMapFrom<IsoFileCategory>, IMapTo<IsoFileCategory>
    {
        public int Id { get; set; }
        
        public string Name { get; set; }

        public string Description { get; set; }
    }
}
