namespace IntraSoft.Data.Dtos.Home
{
    using System.ComponentModel.DataAnnotations;
    using IntraSoft.Services.Mapping;
    using IntraSoft.Data.Models;

    public class HomeUpdateDto: IMapTo<Home>
    {
        [Required]
        public string Content { get; set; }
    }
}
