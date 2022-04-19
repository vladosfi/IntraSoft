namespace IntraSoft.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Data.Dtos.Contact;
    using IntraSoft.Services.Mapping;

    public class Contact : BaseDeletableModel<int>
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

        [ForeignKey(nameof(Department))]
        public int DepartmentId { get; set; }

        public virtual Department Department { get; set; }
    }
}
