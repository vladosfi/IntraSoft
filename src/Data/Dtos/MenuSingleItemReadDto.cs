namespace IntraSoft.Data.Dtos
{
    using System.Collections.Generic;
    using IntraSoft.Data.Models;

    public class MenuSingleItemReadDto
    {
        public int Id { get; set; }

        public int? ParentId { get; set; }

        public string Text { get; set; }

        public string Icon { get; set; }

        public string RouterLink { get; set; }
    }
}