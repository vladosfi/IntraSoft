namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.IsoCategory;
    using IntraSoft.Data.Dtos.IsoService;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class IsoFileCategoriesController : ControllerBase
    {
        private readonly IIsoFileCategoryService isoFileCategoryService;

        public IsoFileCategoriesController(IIsoFileCategoryService isoFileCategoryService)
        {
            this.isoFileCategoryService = isoFileCategoryService;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var isoFileCategoryReadDto = await this.isoFileCategoryService.GetAllAsync<IsoFileCategoryReadDto>();

            if (isoFileCategoryReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(isoFileCategoryReadDto);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}", Name = nameof(GetIsoFileCategoryById))]
        public async Task<ActionResult<IsoFileCategoryReadDto>> GetIsoFileCategoryById(int id)
        {
            var isoFileCategoryItems = await this.isoFileCategoryService.GetByIdAsync<IsoFileCategoryReadDto>(id);

            if (isoFileCategoryItems == null)
            {
                return this.NotFound();
            }

            return this.Ok(isoFileCategoryItems);
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<IsoFileCategoryCreateDto>> Post([FromBody] IsoFileCategoryCreateDto isoFileCategoryDto)
        {
            var newIsoFileCategory = AutoMapperConfig.MapperInstance.Map<IsoFileCategory>(isoFileCategoryDto);

            await this.isoFileCategoryService.CreateAsync(newIsoFileCategory);

            var isoFileCategoryReadDto = AutoMapperConfig.MapperInstance.Map<IsoFileCategoryReadDto>(newIsoFileCategory);


            return this.CreatedAtRoute(
                nameof(this.GetIsoFileCategoryById),
                new { Id = isoFileCategoryReadDto.Id },
                isoFileCategoryReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, IsoFileCategoryUpdateDto isoFileCategoryUpdateDto)
        {
            var isoFileCategoryFromRepo = await this.isoFileCategoryService.GetByIdAsync(id);

            if (isoFileCategoryFromRepo == null)
            {
                return this.NotFound();
            }

            AutoMapperConfig.MapperInstance.Map<IsoFileCategoryUpdateDto, IsoFileCategory>(isoFileCategoryUpdateDto,isoFileCategoryFromRepo);

            this.isoFileCategoryService.Update(isoFileCategoryFromRepo);
            await this.isoFileCategoryService.SaveChangesAsync();

            return this.NoContent();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var isoFileCategoryFromRepo = await this.isoFileCategoryService.GetByIdAsync(id);

            if (isoFileCategoryFromRepo == null)
            {
                return this.NotFound();
            }

            this.isoFileCategoryService.Delete(isoFileCategoryFromRepo);
            await this.isoFileCategoryService.SaveChangesAsync();

            return this.NoContent();
        }
    }
}