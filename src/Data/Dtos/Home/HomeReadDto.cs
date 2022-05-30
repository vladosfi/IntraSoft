namespace IntraSoft.Data.Dtos.Home
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using src.Data.Dtos.IsoFile;
    using System.Collections.Generic;
    using System;

    public class HomeReadDto : IMapFrom<IsoService>
    {

        public int Id { get; set; }
        
        public string Name { get; set; }

        public string Number { get; set; }

        public DateTime CreatedOn { get; set; }
    }
}
