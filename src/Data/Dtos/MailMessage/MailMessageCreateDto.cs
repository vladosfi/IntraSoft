namespace IntraSoft.Data.Dtos.MailMessage
{
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Http;

    public class MailMessageCreateDto : IMapTo<MailMessage>
    {
        [Required]
        [MinLength(5)]
        public string Recipients { get; set; }

        [Required]
        [MinLength(5)]
        [EmailAddress]
        public string From { get; set; }

        [Required]
        public string Subject { get; set; }

        [Required]
        public string Content { get; set; }

        public string AttachmentNames
        {
            get
            {
                var tmpNames = "";
                if(this.Attachments != null){
                    tmpNames = string.Join("|",this.Attachments.Select(a => a.FileName.Trim()));
                }
                
                return tmpNames;
            }
        }

        public IFormFileCollection Attachments { get; set; }
    }
}
