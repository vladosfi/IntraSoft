﻿namespace IntraSoft.Data.Dtos.Order
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class OrderCreateDto : IMapTo<Order>
    {
        public int Id { get; set; }
        
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

        public string Category { get; set; }
    }
}