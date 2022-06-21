namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Order;
    using IntraSoft.Data.Dtos.OrderCategory;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Common;
    using IntraSoft.Services.Data.Order;
    using IntraSoft.Services.Data.OrderCategory;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService orderService;

        private readonly IWebHostEnvironment hostingEnvironment;

        private readonly IOrderCategoryService orderCategoryService;

        private const string MAIN_ORDER_DIRECTORY = "uploads\\заповеди";

        private readonly string webRootPath;


        public OrdersController(
            IOrderService orderService,
            IWebHostEnvironment hostingEnvironment,
            IOrderCategoryService orderCategoryService
        )
        {
            this.orderService = orderService;
            this.orderCategoryService = orderCategoryService;
            this.hostingEnvironment = hostingEnvironment;
            webRootPath = hostingEnvironment.WebRootPath;

        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ordersReadDto =
                await this.orderService.GetAllAsync<OrderReadDto>();

            if (ordersReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(ordersReadDto);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}/{open:bool?}", Name = nameof(GetOrderById))]
        public async Task<ActionResult<OrderReadDto>>
        GetOrderById(int id, bool? open = false)
        {
            var orderItems =
                await this.orderService.GetByIdAsync<OrderReadDto>(id);

            if (orderItems == null)
            {
                return this.NotFound();
            }

            var fullPath = FileService.PathCombine(webRootPath, orderItems.FilePath.ToString());
            if (!FileService.FileExists(fullPath)) return this.NotFound();

            var readedFile = await FileService.ReadFileAsync(fullPath);
            var fileName = FileService.GetFileName(fullPath);
            var ext = FileService.GetFileExtensionFromPath(fullPath);

            // To download or open file

            if (open == true)
            {
                Response
                    .Headers
                    .Add("Content-Disposition", "inline; filename=" + fileName);
                return new PhysicalFileResult(fullPath,
                    StringOperations.GetMimeTypes()[ext]);
            }
            else
            {
                return File(readedFile,
                StringOperations.GetMimeTypes()[ext],
                fileName);
            }
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<OrderCreateDto>>
        Post([FromForm] OrderCreateDto itemDto)
        {
            var newOrderItem = AutoMapperConfig.MapperInstance.Map<Order>(itemDto);

            var categoryFromRepo = await this.orderCategoryService.GetByIdAsync<OrderCategoryReadDto>(itemDto.OrderCategoryId);

            var destPath = FileService.PathCombine(MAIN_ORDER_DIRECTORY,categoryFromRepo.Name);
            int year = itemDto.Date.Year;
            destPath = FileService.PathCombine(destPath, year.ToString());
            var destPathWithFileName = FileService.PathCombine(destPath, itemDto.Number);
            var destPathWithFileNameAndExtension = destPathWithFileName + FileService.GetFileExtensionFromFile(itemDto.File);
            var fullPath = FileService.PathCombine(webRootPath, destPathWithFileNameAndExtension);

            await FileService.CreateAsync(itemDto.File, fullPath);
            newOrderItem.FilePath = destPathWithFileNameAndExtension;  

            await this.orderService.CreateAsync(newOrderItem);
            await this.orderService.SaveChangesAsync();

            var orderReadDto = AutoMapperConfig.MapperInstance.Map<OrderReadDto>(newOrderItem);

            orderReadDto.OrderCategoryName = categoryFromRepo.Name;

            return this
                .CreatedAtRoute(nameof(this.GetOrderById),
                new { Id = orderReadDto.Id },
                orderReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult>
        UpdateCommand(int id, [FromForm] OrderUpdateDto itemDto)
        {
            var itemFromRepo = await this.orderService.GetByIdAsync(id);

            if (itemFromRepo == null)
            {
                return this.NotFound();
            }

            var categoryFromRepo = await this.orderCategoryService.GetByIdAsync<OrderCategoryReadDto>(itemFromRepo.OrderCategoryId);
            var categoryFromQuery = await this.orderCategoryService.GetByIdAsync<OrderCategoryReadDto>(itemDto.OrderCategoryId);

            var newPath = FileService.PathCombine(MAIN_ORDER_DIRECTORY,categoryFromQuery.Name);
            // uploads\заповеди\Гл. Арх ОВ\
            
            int year = itemDto.Date.Year;
            newPath = FileService.PathCombine(newPath, year.ToString());
            // uploads\заповеди\Гл. Арх ОВ\2017
            
            var oldPath = itemFromRepo.FilePath;

            itemFromRepo.About = itemDto.About;
            itemFromRepo.Date = itemDto.Date;
            itemFromRepo.Number = itemDto.Number;

            if (itemDto.File != null)
            {
                FileService.Delete(webRootPath, oldPath);

                var newPathWithFileName = FileService.PathCombine(newPath, itemDto.Number);
                // \uploads\заповеди\Гл. Арх ОВ\2017\fileName        

                var newPathWithFileNameAndExtension = newPathWithFileName + FileService.GetFileExtensionFromFile(itemDto.File);
                // \uploads\заповеди\Гл. Арх ОВ\2017\fileName.pdf

                itemFromRepo.FilePath = newPathWithFileNameAndExtension;
                newPathWithFileNameAndExtension = FileService.PathCombine(webRootPath, newPathWithFileNameAndExtension);       
                await FileService.CreateAsync(itemDto.File, newPathWithFileNameAndExtension);            
            }
            else
            {
                var newFileName = itemDto.Number + FileService.GetFileExtensionFromPath(oldPath);
                newPath = FileService.PathCombine(newPath, newFileName);
                itemFromRepo.FilePath = newPath;
                var destFile = FileService.PathCombine(webRootPath,newPath);
                oldPath = FileService.PathCombine(webRootPath, oldPath);
                
                FileService.MoveFile(oldPath , destFile);
            }
            
            itemFromRepo.OrderCategoryId = itemDto.OrderCategoryId;
            this.orderService.Update(itemFromRepo);
            await this.orderService.SaveChangesAsync();

            return this.NoContent();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var orderItemFromRepo = await this.orderService.GetByIdAsync(id);

            if (orderItemFromRepo == null)
            {
                return this.NotFound();
            }

            this.orderService.Delete(orderItemFromRepo);
            await this.orderService.SaveChangesAsync();

            // Delete form filesystem
            //string path = Path.Combine(webRootPath, orderItemFromRepo.FilePath);
            FileService.Delete(webRootPath, orderItemFromRepo.FilePath);

            return this.NoContent();
        }
    }
}
