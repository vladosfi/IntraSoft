namespace IntraSoft.Data.Dtos
{
    using System.Collections.Generic;
    using IntraSoft.Data.Models;

    public class MenuReadDto
    {
        public int Id { get; set; }

        public int? ParentId { get; set; }

        public string Title { get; set; }

        public string Action { get; set; }

        public string Description { get; set; }

        public virtual ICollection<MenuReadDto> SubMenus { get; set; }
    }
}
