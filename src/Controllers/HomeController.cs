namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Home;
    using IntraSoft.Data.Dtos.StateNewspaper;
    using IntraSoft.Services.Data.Home;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
     {
        // private readonly ILogger<HomeController> _logger;
        // public HomeController(ILogger<HomeController> logger)
        // {
        //     _logger = logger;
        // }
        // [HttpGet]
        // public IEnumerable<string> Get()
        // {
        //     _logger.LogDebug("This is a debug message");
        //     _logger.LogInformation("This is an info message");  
        //     _logger.LogWarning("This is a warning message ");
        //     _logger.LogError(new Exception(), "This is an error message");
        //     return new string[] { "Cool", "Weather" };
        // }
        
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
            var lastStateNewspaperReadDto = await this.homeService.GetLastStateNewspapers<StateNewspaperReadDto>();
            var content = await this.homeService.GetContent<HomeReadDto>();

            if (lastServicesReadDto == null && lastOrdersReadDto == null && lastStateNewspaperReadDto == null)
            {
                return this.NoContent();
            }

            var homeReadDto = new HomeReadDto{
                IsoServices = lastServicesReadDto,
                Orders = lastOrdersReadDto,
                StateNewspapers = lastStateNewspaperReadDto ,
                Content = content.Content,
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