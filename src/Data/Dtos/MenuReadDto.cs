namespace IntraSoft.Data.Dtos
{
    using IntraSoft.Data.Models;

    public class MenuReadDto
    {
        public int Id { get; set; }

        public int? ParentId { get; set; }

        public string Title { get; set; }

        public string Action { get; set; }

        public string Description { get; set; }

        public Menu ParrentMenu { get; set; }
    }
}
