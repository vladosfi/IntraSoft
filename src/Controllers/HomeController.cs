namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Home;
    using IntraSoft.Data.Dtos.StateNewspaper;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data.Home;
    using IntraSoft.Services.Mapping;
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

        // GET api/<HomeController>/5
        [HttpGet("{id}", Name = nameof(GetHomeById))]
        public async Task<ActionResult<HomeReadDto>> GetHomeById(int id)
        {
            var homeItem = await this.homeService.GetByIdAsync<HomeReadDto>(id);

            if (homeItem == null)
            {
                return this.NotFound();
            }

            return this.Ok(homeItem);
        }


        // POST api/<ContactsController>
        [HttpPost]
        public async Task<ActionResult<HomeCreateDto>> Post([FromBody] HomeCreateDto homeItemDto)
        {
            var newHomeItem = AutoMapperConfig.MapperInstance.Map<Home>(homeItemDto);

            await this.homeService.CreateAsync(newHomeItem);

            await this.homeService.SaveChangesAsync();
            var homeReadDto = AutoMapperConfig.MapperInstance.Map<HomeReadDto>(newHomeItem);


            return this.CreatedAtRoute(
                nameof(this.GetHomeById),
                new { Id = homeReadDto.Id },
                homeReadDto);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, HomeUpdateDto homeItemUpdateDto)
        {
            var homeItemFromRepo = await this.homeService.GetByIdAsync(id);

            if (homeItemFromRepo == null)
            {
                return this.NotFound();
            }

            AutoMapperConfig.MapperInstance.Map<HomeUpdateDto, Home>(homeItemUpdateDto, homeItemFromRepo);

            this.homeService.Update(homeItemFromRepo);
            await this.homeService.SaveChangesAsync();

            return this.NoContent();
        }
    }
}