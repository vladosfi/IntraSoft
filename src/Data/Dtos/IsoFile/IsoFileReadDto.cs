namespace src.Data.Dtos.IsoFile
{
    using IntraSoft.Services.Mapping;
        using IntraSoft.Data.Models;
    using IntraSoft.Data.Dtos.IsoCategory;

    public class IsoFileReadDto: IMapFrom<IsoFile>, IMapTo<IsoFile>
    {
        public string FilePath { get; set; }

        public int Id { get; set; }

        public IsoFileCategoryReadDto IsoFileCategory { get; set; }
    }
}