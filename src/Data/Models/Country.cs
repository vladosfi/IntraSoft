namespace WorldCities.Data.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Countries")]
    public class Country
    {
        public Country()
        {
            this.Cities = new HashSet<City>();
        }

        [Key]
        [Required]
        public int Id { get; set; }

        public string Name { get; set; }

        public string ISO2 { get; set; }

        public string ISO3 { get; set; }

        public virtual ICollection<City> Cities { get; set; }
    }
}