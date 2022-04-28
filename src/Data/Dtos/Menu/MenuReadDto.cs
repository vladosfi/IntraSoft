namespace IntraSoft.Data.Dtos.Menu
{
    using System.Collections.Generic;
    using IntraSoft.Data.Dtos.Document;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class MenuReadDto: IMapTo<Menu>, IMapFrom<Menu>
    {
        public int Id { get; set; }

        public int? ParentId { get; set; }

        public string Text { get; set; }

        public string Icon { get; set; }

        public string RouterLink { get; set; }

        public virtual ICollection<MenuReadDto> Children { get; set; }

        public virtual DocumentReadDto Document { get; set; }
    }
}