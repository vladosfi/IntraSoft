namespace IntraSoft.Controllers
{
    using System.Linq;
    using System.Threading.Tasks;
    using AutoMapper;
    using IntraSoft.Data.Dtos.Department;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly IDepartmentService departmentService;

        public DepartmentController(IMapper mapper, IDepartmentService departmentService)
        {
            this.departmentService = departmentService;
            this.mapper = mapper;
        }

        //// GET: api/<ValuesController>
        [HttpGet, Route(nameof(GetAllWithIsoServices))]
        public async Task<IActionResult> GetAllWithIsoServices()
        {
            var departmentsWithIsoServicesReadDto = await this.departmentService.GetAllWithIsoServicesAsync<DepartmentWithIsoServicesReadDto>();
            departmentsWithIsoServicesReadDto = departmentsWithIsoServicesReadDto.OrderBy(x => x.Id);
            
            if (departmentsWithIsoServicesReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(departmentsWithIsoServicesReadDto);
        }


        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var departmentsReadDto = await this.departmentService.GetAllAsync<DepartmentReadDto>();

            if (departmentsReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(departmentsReadDto);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}", Name = nameof(GetDepartmentById))]
        public async Task<ActionResult<DepartmentReadDto>> GetDepartmentById(int id)
        {
            var departmentItems = await this.departmentService.GetByIdAsync<DepartmentReadDto>(id);

            if (departmentItems == null)
            {
                return this.NotFound();
            }

            return this.Ok(departmentItems);
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<DepartmentCreateDto>> Post([FromBody] DepartmentCreateDto departmentItemDto)
        {
            var newDepartmentItem = this.mapper.Map<Department>(departmentItemDto);

            await this.departmentService.AddAsync(newDepartmentItem);

            var departmentReadDto = this.mapper.Map<DepartmentReadDto>(newDepartmentItem);

            return this.CreatedAtRoute(
                nameof(this.GetDepartmentById),
                new { Id = departmentReadDto.Id },
                departmentReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, DepartmentUpdateDto departmentUpdateDto)
        {
            var departmentItemFromRepo = await this.departmentService.GetByIdAsync(id);

            if (departmentItemFromRepo == null)
            {
                return this.NotFound();
            }

            this.mapper.Map(departmentUpdateDto, departmentItemFromRepo);
            this.departmentService.Update(departmentItemFromRepo);
            await this.departmentService.SaveChangesAsync();

            return this.NoContent();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var departmentItemFromRepo = await this.departmentService.GetByIdAsync(id);

            if (departmentItemFromRepo == null)
            {
                return this.NotFound();
            }

            this.departmentService.Delete(departmentItemFromRepo);
            await this.departmentService.SaveChangesAsync();

            return this.NoContent();
        }
    }
}