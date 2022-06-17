using System.Threading.Tasks;

namespace IntraSoft.Services.Mail
{
    public interface IEmailSender
    {
        void SendEmail(Message message);

        Task<string> SendEmailAsync(Message message);
    }
}
