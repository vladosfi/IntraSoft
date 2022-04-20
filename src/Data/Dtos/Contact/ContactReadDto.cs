﻿namespace IntraSoft.Data.Dtos.Contact
{

    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;
    using System.Collections.Generic;
    using IntraSoft.Data.Dtos.Department;

    public class ContactReadDto : IMapFrom<Contact>, IMapTo<Contact>
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public int DepartmentId { get; set; }

        //public string FullName => string.Join(" ", this.FirstName, this.MiddleName, this.LastName);
    }
}
