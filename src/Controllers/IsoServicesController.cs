namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.IsoService;
    using IntraSoft.Services.Data;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class IsoServicesController : ControllerBase
    {
        private readonly IIsoService isoService;

        public IsoServicesController(IIsoService isoService)
        {
            this.isoService = isoService;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var isoServiceReadDto = await this.isoService.GetAllAsync<IsoServiceReadDto>();

            if (isoServiceReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(isoServiceReadDto);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}", Name = nameof(GetIsoServiceById))]
        public async Task<ActionResult<IsoServiceReadDto>> GetIsoServiceById(int id)
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
            // TO DO -  Reject if service with same name exist 
            var newIsoService = AutoMapperConfig.MapperInstance.Map<Data.Models.IsoService>(isoServiceDto);

            await this.isoService.CreateAsync(newIsoService);

            var isoServiceReadDto = AutoMapperConfig.MapperInstance.Map<IsoServiceReadDto>(newIsoService);


            return this.CreatedAtRoute(
                nameof(this.GetIsoServiceById),
                new { Id = isoServiceReadDto.Id },
                isoServiceReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, IsoServiceUpdateDto isoServiceUpdateDto)
        {
            // TO DO -  Reject if service with same name exist 
            var isoServiceFromRepo = await this.isoService.GetByIdAsync(id);

            if (isoServiceFromRepo == null)
            {
                return this.NotFound();
            }

            AutoMapperConfig.MapperInstance.Map<IsoServiceUpdateDto, Data.Models.IsoService>(isoServiceUpdateDto, isoServiceFromRepo);

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