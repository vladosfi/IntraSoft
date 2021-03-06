namespace IntraSoft.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;

    [Table("Menus")]
    public class Menu : BaseDeletableModel<int>
    {
        public Menu()
        {
            this.Children = new HashSet<Menu>();
        }

        [Required]
        [MaxLength(100)]
        public string Text { get; set; }

        [MaxLength(100)]
        public string Icon { get; set; }

        [Required]
        [MaxLength(250)]
        public string RouterLink { get; set; }

        public int? ParentId { get; set; }

        public virtual Menu ParentMenu { get; set; }

        public virtual ICollection<Menu> Children { get; set; }

        public virtual Document Document { get; set; }
    }
}
