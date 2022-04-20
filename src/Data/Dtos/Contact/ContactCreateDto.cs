namespace IntraSoft.Data.Dtos.Contact
{
    using System.ComponentModel.DataAnnotations;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class ContactCreateDto: IMapFrom<Contact>, IMapTo<Contact>
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [MaxLength(100)]
        public string MiddleName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        //[Required(ErrorMessage = "Mobile no. is required")]
        //[RegularExpression("^(?!0+$)(\\+\\d{1,3}[- ]?)?(?!0+$)\\d{10,15}$", ErrorMessage = "Please enter valid phone no.")]
        [Phone]
        public string Phone { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        public int DepartmentId { get; set; }
    }
}