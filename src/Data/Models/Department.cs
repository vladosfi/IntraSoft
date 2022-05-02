namespace IntraSoft.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Services.Mapping;

    [Table("Departments")]
    public class Department : BaseDeletableModel<int>, IMapTo<Department>, IMapFrom<Department>
    {
        public Department()
        {
            this.Contacts = new HashSet<Contact>();
            this.IsoServices = new HashSet<IsoService>();
        }

        [Required]
        [MaxLength(100)]
        [MinLength(2)]
        public string Name { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }

        public virtual ICollection<Contact> Contacts { get; set; }

        public virtual ICollection<IsoService> IsoServices { get; set; }
    }
}