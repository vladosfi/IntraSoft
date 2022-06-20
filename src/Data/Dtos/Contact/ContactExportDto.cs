namespace IntraSoft.Data.Dtos.Contact
{
    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using OfficeOpenXml.Attributes;

    public class ContactExportDto : IMapFrom<Contact>
    {
        public string FullName => string.Join(" ", this.FirstName, this.MiddleName, this.LastName);

        public string Position { get; set; }
        
        public string Room { get; set; }

        public string Phone { get; set; }

        public string WorkPhone { get; set; }

        public string PrivatePhone { get; set; }
        
        public string Email { get; set; }
        
        public string DepartmentName { get; set; }

        [EpplusIgnore]
        public string FirstName { get; set; }

        [EpplusIgnore]
        public string MiddleName { get; set; }

        [EpplusIgnore]
        public string LastName { get; set; }
    }
}
