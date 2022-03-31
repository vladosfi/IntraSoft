﻿namespace IntraSoft.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using AutoMapper;
    using IntraSoft.Data;
    using IntraSoft.Data.Dtos;
    using IntraSoft.Data.Models;
    using Microsoft.AspNetCore.Mvc;
    using Newtonsoft.Json;

    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuAPIRepo repo;
        private readonly IMapper mapper;

        public MenuController(IMenuAPIRepo repo, IMapper mapper)
        {
            this.repo = repo;
            this.mapper = mapper;
        }

        // GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var menuItems = await this.repo.GetAllAsync();

            if (menuItems == null)
            {
                return this.NoContent();
            }

            var menuReadDto = this.mapper.Map<IEnumerable<MenuReadDto>>(menuItems);

            return this.Ok(menuReadDto);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}", Name = nameof(Get))]
        public async Task<ActionResult<MenuReadDto>> Get(int id)
        {
            var menuItems = await this.repo.GetByIdAsync(id);

            if (menuItems == null)
            {
                return this.NotFound();
            }

            return this.Ok(this.mapper.Map<MenuReadDto>(menuItems));
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<MenuReadDto>> Post([FromBody] MenuCreateDto menuItemDto)
        {
            var newMenuItem = this.mapper.Map<Menu>(menuItemDto);

            if (newMenuItem.ParentId == null)
            {
                await this.repo.CreateAsync(newMenuItem);
            }
            else
            {
                var parentId = (int)newMenuItem.ParentId;
                var parenMenuItem = await this.repo.GetByIdAsync(parentId);

                if (parenMenuItem != null)
                {
                    parenMenuItem.Children.Add(newMenuItem);
                }
            }

            await this.repo.SaveChangesAsync();
            var menuReadDto = this.mapper.Map<MenuReadDto>(newMenuItem);

            return this.CreatedAtRoute(
                nameof(this.Get),
                new { Id = menuReadDto.Id },
                menuReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, MenuUpdateDto commandUpdateDto)
        {
            var menuItemFromRepo = await this.repo.GetByIdAsync(id);

            if (menuItemFromRepo == null)
            {
                return this.NotFound();
            }

            this.mapper.Map(commandUpdateDto, menuItemFromRepo);
            this.repo.Update(menuItemFromRepo);
            await this.repo.SaveChangesAsync();

            return this.NoContent();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var menuItemFromRepo = await this.repo.GetByIdAsync(id);

            if (menuItemFromRepo == null)
            {
                return this.NotFound();
            }

            this.repo.Delete(menuItemFromRepo);
            await this.repo.SaveChangesAsync();

            return this.NoContent();
        }
    }
}