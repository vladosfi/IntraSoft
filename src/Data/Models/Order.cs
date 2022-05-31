namespace IntraSoft.Data.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using IntraSoft.Data.Common.Models;

    [Table("Orders")]
    public class Order : BaseDeletableModel<int>
    {
        [Required]
        [MaxLength(50)]
        public string Number { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(500)]
        public string About { get; set; }

        [Required]
        [MaxLength(200)]
        public string FilePath { get; set; }

        public OrderCategory Category { get; set; }
    }
}
