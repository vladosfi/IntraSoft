namespace IntraSoft.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Services.Mapping;

    [Table("IsoServices")]
    public class IsoService: BaseDeletableModel<int>, IMapTo<IsoService>, IMapFrom<IsoService>
    {
        public IsoService()
        {
            this.IsoFiles = new HashSet<IsoFile>();
        }

        [Required]
        [MaxLength(250)]
        [MinLength(2)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string Number { get; set; }

        public virtual ICollection<IsoFile> IsoFiles { get; set; }

        [ForeignKey(nameof(Department))]
        public int DepartmentId { get; set; }

        public virtual Department Department { get; set; }
    }
}
