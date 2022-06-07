// namespace IntraSoft.Data.Models
// {
//     using System.ComponentModel.DataAnnotations;
//     using System.ComponentModel.DataAnnotations.Schema;
//     using IntraSoft.Data.Common.Models;

//     [Table("DocumentFiles")]
//     public class DocumentFile : BaseDeletableModel<int>
//     {
//         [Required]
//         [MaxLength(250)]
//         public string Path { get; set; }

//         [MaxLength(50)]
//         public string UserName { get; set; }

//         public virtual Order Order { get; set; }
//     }
// }
