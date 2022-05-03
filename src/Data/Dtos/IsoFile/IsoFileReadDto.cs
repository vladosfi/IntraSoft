namespace src.Data.Dtos.IsoFile
{
    using IntraSoft.Services.Mapping;
        using IntraSoft.Data.Models;

    public class IsoFileReadDto: IMapFrom<IsoFile>, IMapTo<IsoFile>
    {
        public string Path { get; set; }

        public string Description { get; set; }

        public int IsoCategoryId { get; set; }

        public int IsoServicesId { get; set; }
    }
}