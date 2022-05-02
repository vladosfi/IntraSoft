namespace IntraSoft.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;
    using IntraSoft.Services.Mapping;

    [Table("IsoFileCategories")]
    public class IsoFileCategory : BaseDeletableModel<int>, IMapTo<IsoFileCategory>, IMapFrom<IsoFileCategory>
    {
        public IsoFileCategory(){
            this.IsoFiles = new HashSet<IsoFile>();
        }

        [Required]
        [MaxLength(250)]
        public string Name { get; set; }

        [MaxLength(250)]
        public string Description { get; set; }

        public virtual ICollection<IsoFile> IsoFiles { get; set; }

    // Instructions - Инструкции
    // Requests - Искане
    // Declarations - Декларация
    // Applications - Заявление
    // Enclosure - Приложение

    }
}
