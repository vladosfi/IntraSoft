namespace IntraSoft.Data.Dtos.ErrorLog
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using System;

    public class ErrorLogReadDto : IMapFrom<Log>
    {
        public int Id { get; set; }

        public int Level { get; set; }

        public string Message { get; set; }

        public string StackTrace { get; set; }

        public string Exception { get; set; }

        public string Logger { get; set; }

        public string Url { get; set; }

        public string HostName { get; set; }
        
        public DateTime CreatedOn { get; set; }
    }
}
