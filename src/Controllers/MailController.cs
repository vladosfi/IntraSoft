namespace IntraSoft.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.MailMessage;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data.MailMessage;
    using IntraSoft.Services.Mail;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly IEmailSender emailSender;

        private readonly IMailMessageService mailMessageService;

        public MailController(IEmailSender emailSender, IMailMessageService mailMessageService)
        {
            this.mailMessageService = mailMessageService;
            this.emailSender = emailSender;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public IEnumerable<Object> Get()
        {
            var rng = new Random();
            var message =
                new Message(new string[] { "vgivanov@varna.bg" },
                    "vgivanov@varna.bg",
                    "Test email",
                    "This is the content from our email.",
                    null);
            this.emailSender.SendEmail(message);
            return Enumerable
                .Range(1, 5)
                .Select(index =>
                    new
                    {
                        Date = DateTime.Now.AddDays(index),
                        TemperatureC = rng.Next(-20, 55)
                    })
                .ToArray();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] MailMessageCreateDto inputMessage)
        {

            var mailMessage = AutoMapperConfig.MapperInstance.Map<MailMessage>(inputMessage);
            mailMessage.Success = false;

            var defaultRecipients = new string[] { "vgivanov@varna.bg", "vgivanov@varna.bg" };
            defaultRecipients = inputMessage.Recipients == null ? defaultRecipients : inputMessage.Recipients.Split(';').ToArray();

            var from = inputMessage.From;
            var subject = inputMessage.Subject;
            var content = inputMessage.Content;
            var files = Request.Form.Files.Any() ? Request.Form.Files : new FormFileCollection();

            try
            {
                var message = new Message(defaultRecipients, from, subject, content, files);

                var serverResponse = await this.emailSender.SendEmailAsync(message);

                if (!serverResponse.ToLower().Contains("2.0.0 ok"))
                {
                    return this.BadRequest();
                }

                mailMessage.Success = true;

                return this.Ok();
            }
            catch (Exception ex)
            {
                mailMessage.ErrorMessage = ex.Message;
                throw;
            }
            finally
            {
                await this.mailMessageService.CreateAsync(mailMessage);
                await this.mailMessageService.SaveChangesAsync();
            }

        }
    }
}
