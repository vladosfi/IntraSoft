namespace IntraSoft.Data.Dtos.Home
{
    using System.ComponentModel.DataAnnotations;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Mapping;

    public class HomeCreateDto: IMapTo<Home>
    {
        [Required]
        public string Content { get; set; }
    }
}