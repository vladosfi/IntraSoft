namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Home;
    using IntraSoft.Services.Data;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IHomeService homeService;

        public HomeController(IHomeService homeService)
        {
            this.homeService = homeService;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contactsReadDto = await this.homeService.GetLastServices<HomeReadDto>();

            if (contactsReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(contactsReadDto);
        }

        // GET api/<ValuesController>/5
        // [HttpGet("{id}", Name = nameof(GetContactById))]
        // public async Task<ActionResult<ContactReadDto>> GetContactById(int id)
        // {
        //     var contactItems = await this.homeService.GetByIdAsync<ContactReadDto>(id);

        //     if (contactItems == null)
        //     {
        //         return this.NotFound();
        //     }

        //     return this.Ok(contactItems);
        // }
    }
}