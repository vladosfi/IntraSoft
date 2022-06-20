namespace IntraSoft.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Services.Mapping;

    [Table("Contacts")]
    public class Contact : BaseDeletableModel<int>, IMapFrom<Contact>
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [MaxLength(100)]
        public string MiddleName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [Required]
        [MaxLength(100)]
        public string Position { get; set; }

        [Required]
        [MaxLength(50)]
        public string Room { get; set; }

        //[Required(ErrorMessage = "Mobile no. is required")]
        //[RegularExpression("^(?!0+$)(\\+\\d{1,3}[- ]?)?(?!0+$)\\d{10,15}$", ErrorMessage = "Please enter valid phone no.")]
        [Phone]
        [MaxLength(6)]
        public string Phone { get; set; }

        [Phone]
        [MaxLength(10)]
        [MinLength(9)]
        public string WorkPhone { get; set; }

        [Phone]
        [MaxLength(10)]
        [MinLength(9)]
        public string PrivatePhone { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [ForeignKey(nameof(Department))]
        public int DepartmentId { get; set; }

        public virtual Department Department { get; set; }
    }
}
