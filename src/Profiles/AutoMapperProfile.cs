﻿namespace IntraSoft.Profiles
{
    using AutoMapper;
    using IntraSoft.Data.Dtos;
    using IntraSoft.Data.Dtos.Contact;
    using IntraSoft.Data.Models;

    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Source ➤ Target
            this.CreateMap<MenuCreateDto, Menu>();
            this.CreateMap<Menu, MenuReadDto>();
            this.CreateMap<Menu, MenuSingleItemReadDto>();
            this.CreateMap<MenuUpdateDto, Menu>();
            this.CreateMap<ContactCreateDto, Contact>().ReverseMap();
            this.CreateMap<ContactReadDto, Contact>().ReverseMap();
            this.CreateMap<ContactUpdateDto, Contact>();            
        }
    }
}
