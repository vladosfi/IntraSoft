namespace IntraSoft.Data.Dtos.Document
{
    using IntraSoft.Services.Mapping;

    public class DocReadDto: IMapTo<Document>, IMapFrom<Document>
    {        public string FilePath { get; set; }

    }
}
