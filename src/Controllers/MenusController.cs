namespace IntraSoft.Controllers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using AutoMapper;
    using IntraSoft.Data.Dtos.Menu;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data;
    using IntraSoft.Services.Data.Menu;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class MenusController : ControllerBase
    {
        private readonly IMenuService menuService;
        private readonly IDocumentService documentService;

        public MenusController(IMenuService menuService, IDocumentService documentService)
        {
            this.documentService = documentService;
            this.menuService = menuService;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var menuItems = await this.menuService.GetAllAsync();

            if (menuItems == null)
            {
                return this.NoContent();
            }

            //var menuReadDto = this.mapper.Map<IEnumerable<MenuReadDto>>(menuItems);
            var menuReadDto = AutoMapperConfig.MapperInstance.Map<IEnumerable<MenuReadDto>>(menuItems);

            return this.Ok(menuReadDto);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}", Name = nameof(GetMenu))]
        public async Task<ActionResult<MenuReadDto>> GetMenu(int id)
        {
            var menuItems = await this.menuService.GetByIdAsync<MenuReadDto>(id);

            if (menuItems == null)
            {
                return this.NotFound();
            }

            return this.Ok(menuItems);
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<MenuReadDto>> Post([FromBody] MenuCreateDto menuItemDto)
        {
            //var newMenuItem = this.mapper.Map<Menu>(menuItemDto);
            var newMenuItem = AutoMapperConfig.MapperInstance.Map<Menu>(menuItemDto);


            if (newMenuItem.ParentId == null)
            {
                await this.menuService.CreateAsync(newMenuItem);
            }
            else
            {
                var parentId = (int)newMenuItem.ParentId;
                var parenMenuItem = await this.menuService.GetByIdAsync(parentId);

                if (parenMenuItem != null)
                {
                    parenMenuItem.Children.Add(newMenuItem);
                }
            }

            await this.menuService.SaveChangesAsync();
            //var menuReadDto = this.mapper.Map<MenuReadDto>(newMenuItem);
            var menuReadDto = AutoMapperConfig.MapperInstance.Map<MenuReadDto>(newMenuItem);


            return this.CreatedAtRoute(
                nameof(this.GetMenu),
                new { Id = menuReadDto.Id },
                menuReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, MenuUpdateDto menuUpdateDto)
        {
            var menuItemFromRepo = await this.menuService.GetByIdAsync(id);

            if (menuItemFromRepo == null)
            {
                return this.NotFound();
            }

            //this.mapper.Map(menuUpdateDto, menuItemFromRepo);
            AutoMapperConfig.MapperInstance.Map<MenuUpdateDto, Menu>(menuUpdateDto,menuItemFromRepo);

            this.menuService.Update(menuItemFromRepo);
            await this.menuService.SaveChangesAsync();

            return this.NoContent();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var menuItemFromRepo = await this.menuService.GetByIdAsync(id);

            if (menuItemFromRepo == null)
            {
                return this.NotFound();
            }

            this.menuService.HardDelete(menuItemFromRepo);
            await this.menuService.SaveChangesAsync();

            return this.NoContent();
        }
    }
}