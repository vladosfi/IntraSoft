namespace IntraSoft.Profiles
{
    using AutoMapper;
    using IntraSoft.Data.Dtos;
    using IntraSoft.Data.Models;

    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Source ➤ Target
            this.CreateMap<MenuCreateDto, Menu>();
            this.CreateMap<Menu, MenuReadDto>();
            this.CreateMap<Menu, MenuSingleItemReadDto>();
        }
    }
}
