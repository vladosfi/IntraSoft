namespace IntraSoft.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Menus")]
    public class Menu
    {
        public Menu()
        {
            this.SubMenus = new HashSet<Menu>();
        }

        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required]
        [MaxLength(250)]
        public string Action { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }

        public int? ParentId { get; set; }

        public virtual Menu ParentMenu { get; set; }

        public virtual ICollection<Menu> SubMenus { get; set; }
    }
}
