namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Home;
    using IntraSoft.Data.Dtos.Order;
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
            var lastServicesReadDto = await this.homeService.GetLastServices<HomeIsoServicesReadDto>();
            var lastOrdersReadDto = await this.homeService.GetLastOrders<HomeOrdersReadDto>();

            if (lastServicesReadDto == null && lastOrdersReadDto == null)
            {
                return this.NoContent();
            }

            var homeReadDto = new HomeReadDto{
                IsoServices = lastServicesReadDto,
                Orders = lastOrdersReadDto 
            };

            return this.Ok(homeReadDto);
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