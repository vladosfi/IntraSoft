namespace IntraSoft.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Home;
    using IntraSoft.Data.Dtos.Order;
    using IntraSoft.Services.Data;
    using IntraSoft.Services.Mail;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using MimeKit;

    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly IEmailSender emailSender;

        public MailController(IEmailSender emailSender)
        {
            this.emailSender = emailSender;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public IEnumerable<Object> Get()
        {
            var rng = new Random();
            var message =
                new Message(new string[] { "vgivanov@varna.bg" },
                    "Test email",
                    "This is the content from our email.",
                    null);
            this.emailSender.SendEmail(message);
            return Enumerable
                .Range(1, 5)
                .Select(index =>
                    new {
                        Date = DateTime.Now.AddDays(index),
                        TemperatureC = rng.Next(-20, 55)
                    })
                .ToArray();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm]Message inputMessage)
        {
            
            var defaultRecipients = new string[] { "vgivanov@varna.bg", "vgivanov@varna.bg" };
            defaultRecipients = inputMessage.Recipients == null ? defaultRecipients : inputMessage.Recipients.Split(';').ToArray() ;

            var subject = inputMessage.Subject;
            var content = inputMessage.Content;
            var files = Request.Form.Files.Any() ? Request.Form.Files : new FormFileCollection();

            var message = new Message(defaultRecipients, subject ,content, files);

            var serverResponse =  await this.emailSender.SendEmailAsync(message);

            if(!serverResponse.ToLower().Contains("2.0.0 ok")){
                return this.BadRequest();
            }
            
            return this.Ok();
        }
    }
}
