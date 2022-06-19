namespace IntraSoft.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using AutoMapper;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Services.Mapping;

    [Table("MailMessages")]
    public class MailMessage : BaseDeletableModel<int>
    {
        [Required]
        [MinLength(5)]
        public string Recipients { get; set; }

        [Required]
        public string Subject { get; set; }

        [Required]
        public string Content { get; set; }

        public bool Success { get; set; }

        public string ErrorMessage { get; set; }

        public string AttachmentNames { get; set; }
    }
}
