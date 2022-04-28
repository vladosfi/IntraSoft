namespace IntraSoft.Data.Dtos.Document
{
    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using System.IO;

    public class DocumentReadDto: IMapFrom<Document>
    {
        public int Id { get; set; }
        public string FilePath { get; set; }
        public string FileName => Path.GetFileName(this.FilePath);
    }
}