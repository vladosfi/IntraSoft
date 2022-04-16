﻿namespace IntraSoft.Data.Dtos.Document
{
    using System.ComponentModel.DataAnnotations;
    using IntraSoft.Data.Common.Models;

    public class Document : BaseDeletableModel<int>
    {
        [MaxLength(250)]
        public string FileName { get; set; }

        [MaxLength(250)]
        public string FilePath { get; set; }

        [MaxLength(250)]
        public string Description { get; set; }

        [MaxLength(50)]
        public string UserName { get; set; }
    }
}