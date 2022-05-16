﻿namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using AutoMapper;
    using IntraSoft.Data.Dtos.IsoCategory;
    using IntraSoft.Data.Dtos.IsoService;
    using IntraSoft.Services.Data;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class IsoFileCategoryController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IIsoService isoService;
        private readonly IIsoFileCategoryService isoFileCategoryService;

        public IsoFileCategoryController(IMapper mapper, IIsoService isoService,IIsoFileCategoryService isoFileCategoryService)
        {
            this.isoService = isoService;
            this.isoFileCategoryService = isoFileCategoryService;
            this.mapper = mapper;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var isoServiceReadDto = await this.isoFileCategoryService.GetAllAsync<IsoFileCategoryReadDto>();

            if (isoServiceReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(isoServiceReadDto);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}", Name = nameof(GetIsoFileCategoryById))]
        public async Task<ActionResult<IsoServiceReadDto>> GetIsoFileCategoryById(int id)
        {
            var isoServiceItems = await this.isoService.GetByIdAsync<IsoServiceReadDto>(id);

            if (isoServiceItems == null)
            {
                return this.NotFound();
            }

            return this.Ok(isoServiceItems);
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<IsoServiceCreateDto>> Post([FromBody] IsoServiceCreateDto isoServiceDto)
        {
            var newIsoService = this.mapper.Map<Data.Models.IsoService>(isoServiceDto);

            await this.isoService.CreateAsync(newIsoService);

            var isoServiceReadDto = this.mapper.Map<IsoServiceReadDto>(newIsoService);

            return this.CreatedAtRoute(
                nameof(this.GetIsoFileCategoryById),
                new { Id = isoServiceReadDto.Id },
                isoServiceReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, IsoServiceUpdateDto isoServiceUpdateDto)
        {
            var isoServiceFromRepo = await this.isoService.GetByIdAsync(id);

            if (isoServiceFromRepo == null)
            {
                return this.NotFound();
            }

            this.mapper.Map(isoServiceUpdateDto, isoServiceFromRepo);
            this.isoService.Update(isoServiceFromRepo);
            await this.isoService.SaveChangesAsync();

            return this.NoContent();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var isoServiceFromRepo = await this.isoService.GetByIdAsync(id);

            if (isoServiceFromRepo == null)
            {
                return this.NotFound();
            }

            this.isoService.Delete(isoServiceFromRepo);
            await this.isoService.SaveChangesAsync();

            return this.NoContent();
        }
    }
}