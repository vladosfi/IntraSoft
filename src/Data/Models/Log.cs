namespace IntraSoft.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;

    [Table("Logs")]
    public class Log : BaseDeletableModel<int>
    {
        [MaxLength(10)]
        public int Level { get; set; }

        public string Message { get; set; }

        public string StackTrace { get; set; }

        public string Exception { get; set; }

        [MaxLength(250)]
        public string Logger { get; set; }

        [MaxLength(250)]
        public string Url { get; set; }

        [MaxLength(100)]
        public string HostName { get; set; }
    }
}
