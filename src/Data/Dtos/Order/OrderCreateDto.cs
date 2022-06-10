namespace IntraSoft.Data.Dtos.Order
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Http;
    
    public class OrderCreateDto : IMapTo<Order>
    {
        [Required]
        [MaxLength(50)]
        public string Number { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(500)]
        public string About { get; set; }

        [MaxLength(200)]
        public string FilePath { get; set; }

        [Required]
        public IFormFile File { get; set; }

        [Required]
        public int OrderCategoryId { get; set; }
    }
}
