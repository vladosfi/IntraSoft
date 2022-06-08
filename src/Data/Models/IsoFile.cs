namespace IntraSoft.Data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Services.Mapping;

    [Table("IsoFiles")]
    public class IsoFile : BaseDeletableModel<int>, IMapFrom<IsoFile>
    {
        [Required]
        [MaxLength(250)]
        public string FilePath { get; set; }

        [MaxLength(250)]
        public string Description { get; set; }

        [ForeignKey(nameof(IsoFileCategory))]
        public int IsoCategoryId { get; set; }

        public IsoFileCategory IsoFileCategory { get; set; }


        [ForeignKey(nameof(IsoService))]
        public int IsoServicesId { get; set; }

        public virtual IsoService IsoService { get; set; }
    }
}
