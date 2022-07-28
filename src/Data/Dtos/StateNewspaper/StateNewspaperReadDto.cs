namespace IntraSoft.Data.Dtos.StateNewspaper
{
    using System;
    
    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;

    public class StateNewspaperReadDto : IMapFrom<StateNewspaper>
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Content { get; set; }

        public string Link { get; set; }

        public DateTime CreatedOn { get; set; }
    }
}
