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
            this.Children = new HashSet<Menu>();
        }

        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Text { get; set; }

        [MaxLength(200)]
        public string Icon { get; set; }

        [Required]
        [MaxLength(250)]
        public string RouterLink { get; set; }

        public int? ParentId { get; set; }

        public virtual Menu ParentMenu { get; set; }

        public virtual ICollection<Menu> Children { get; set; }
    }
}