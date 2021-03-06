using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using MimeKit;

namespace IntraSoft.Services.Mail
{
    public class Message
    {
        public Message()
        {
            this.To = new List<MailboxAddress>();
        }

        public List<MailboxAddress> To { get; set; }

        public string From { get; set; }
        
        public string Recipients { get; set; }

        public string Subject { get; set; }

        public string Content { get; set; }

        public IFormFileCollection Attachments { get; set; }


        public Message(IEnumerable<string> to, string from, string subject, string content, IFormFileCollection attachments)
        {
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(string.Empty, x)));
            From = from;
            Subject = subject;
            Content = content;
            Attachments = attachments;

        }
    }
}
