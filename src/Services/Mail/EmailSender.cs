using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace IntraSoft.Services.Mail
{
    public class EmailSender : IEmailSender
    {
        private readonly EmailConfiguration emailConfig;

        public EmailSender(EmailConfiguration emailConfig)
        {
            this.emailConfig = emailConfig;
        }

        public void SendEmail(Message message)
        {
            var emailMessage = CreateEmailMessage(message);
            Send (emailMessage);
        }

        public async Task<string> SendEmailAsync(Message message)
        {
            var mailMessage = CreateEmailMessage(message);

            return await SendAsync(mailMessage);
        }

        private MimeMessage CreateEmailMessage(Message message)
        {
            var emailMessage = new MimeMessage();
            emailMessage
                .From
                .Add(new MailboxAddress("Район Аспарухово", message.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;

            //emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = message.Content };
            var bodyBuilder =
                new BodyBuilder {
                    HtmlBody =
                        string
                            .Format("<h2 style='color:red;'>{0}</h2>",
                            message.Content)
                };

            if (message.Attachments != null && message.Attachments.Any())
            {
                byte[] fileBytes;
                foreach (var attachment in message.Attachments)
                {
                    using (var ms = new MemoryStream())
                    {
                        attachment.CopyTo (ms);
                        fileBytes = ms.ToArray();
                    }
                    bodyBuilder
                        .Attachments
                        .Add(attachment.FileName,
                        fileBytes,
                        ContentType.Parse(attachment.ContentType));
                }
            }

            emailMessage.Body = bodyBuilder.ToMessageBody();
            return emailMessage;
        }

        private async Task<string> SendAsync(MimeMessage mailMessage)
        {
            var serverResponse = string.Empty;

            using (var client = new SmtpClient())
            {
                try
                {
                    await client
                        .ConnectAsync(emailConfig.SmtpServer,
                        emailConfig.Port,
                        SecureSocketOptions.None);
                    serverResponse = await client.SendAsync(mailMessage);
                }
                catch
                {
                    //log an error message or throw an exception, or both.
                    throw;
                }
                finally
                {
                    await client.DisconnectAsync(true);
                    client.Dispose();
                }
            }

            return serverResponse;
        }

        private void Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    //client.CheckCertificateRevocation = false;
                    client
                        .Connect(emailConfig.SmtpServer,
                        emailConfig.Port,
                        SecureSocketOptions.None);

                    // client.AuthenticationMechanisms.Remove("XOAUTH2");
                    // client.Authenticate(_emailConfig.UserName, _emailConfig.Password);
                    client.Send (mailMessage);
                }
                catch
                {
                    //log an error message or throw an exception or both.
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
    }
}
