namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.StateNewspaper;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data.StateNewspaper;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class StateNewspapersController : ControllerBase
    {
        private readonly IStateNewspaperService stateNewsPaperService;

        public StateNewspapersController(IStateNewspaperService stateNewsPaperService)
        {
            this.stateNewsPaperService = stateNewsPaperService;
        }

        //// GET: api/<StateNewspapersController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var stateNewspapersReadDto = await this.stateNewsPaperService.GetAllAsync<StateNewspaperReadDto>();

            if (stateNewspapersReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(stateNewspapersReadDto);
        }

        // GET api/<StateNewspapersController>/5
        [HttpGet("{id}", Name = nameof(GetStateNewspaperById))]
        public async Task<ActionResult<StateNewspaperReadDto>> GetStateNewspaperById(int id)
        {
            var stateNewspaperItems = await this.stateNewsPaperService.GetByIdAsync<StateNewspaperReadDto>(id);

            if (stateNewspaperItems == null)
            {
                return this.NotFound();
            }

            return this.Ok(stateNewspaperItems);
        }

        // POST api/<StateNewspapersController>
        [HttpPost]
        public async Task<ActionResult<StateNewspaperCreateDto>> Post([FromBody] StateNewspaperCreateDto itemDto)
        {
            var newItem = AutoMapperConfig.MapperInstance.Map<StateNewspaper>(itemDto);

            await this.stateNewsPaperService.CreateAsync(newItem);

            await this.stateNewsPaperService.SaveChangesAsync();
            var stateNewspaperReadDto = AutoMapperConfig.MapperInstance.Map<StateNewspaperReadDto>(newItem);


            return this.CreatedAtRoute(
                nameof(this.GetStateNewspaperById),
                new { Id = stateNewspaperReadDto.Id },
                stateNewspaperReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, StateNewspaperUpdateDto stateNewspaperUpdateDto)
        {
            var stateNewspaperItemFromRepo = await this.stateNewsPaperService.GetByIdAsync(id);

            if (stateNewspaperItemFromRepo == null)
            {
                return this.NotFound();
            }

            AutoMapperConfig.MapperInstance.Map<StateNewspaperUpdateDto, StateNewspaper>(stateNewspaperUpdateDto, stateNewspaperItemFromRepo);

            this.stateNewsPaperService.Update(stateNewspaperItemFromRepo);
            await this.stateNewsPaperService.SaveChangesAsync();

            return this.NoContent();
        }

        // DELETE api/<StateNewspapersController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var stateNewspaperItemFromRepo = await this.stateNewsPaperService.GetByIdAsync(id);

            if (stateNewspaperItemFromRepo == null)
            {
                return this.NotFound();
            }

            this.stateNewsPaperService.Delete(stateNewspaperItemFromRepo);
            await this.stateNewsPaperService.SaveChangesAsync();

            return this.NoContent();
        }
    }
}