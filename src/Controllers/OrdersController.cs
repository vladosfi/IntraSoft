namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Order;
    using IntraSoft.Data.Dtos.OrderCategory;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Common;
    using IntraSoft.Services.Data;
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

        public OrdersController(
            IOrderService orderService,
            IWebHostEnvironment hostingEnvironment,
            IOrderCategoryService orderCategoryService
        )
        {
            this.orderService = orderService;
            this.orderCategoryService = orderCategoryService;
            this.hostingEnvironment = hostingEnvironment;
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

            var fullPath =
                FileService
                    .PathCombine(hostingEnvironment.WebRootPath,
                    orderItems.FilePath.ToString());
            if (!FileService.FileExists(fullPath)) return this.NotFound();

            var readedFile = await FileService.ReadFileAsync(fullPath);
            var fileName = FileService.GetFileName(fullPath);
            var ext = FileService.GetFileExtension(fullPath);

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
            var newOrderItem =
                AutoMapperConfig.MapperInstance.Map<Order>(itemDto);

            var orderCategory =
                await this
                    .orderCategoryService
                    .GetByIdAsync<OrderCategoryReadDto>(itemDto
                        .OrderCategoryId);

            itemDto.FilePath = MAIN_ORDER_DIRECTORY + "\\" + orderCategory.Name;

            var filePathWithFileName =
                await FileService
                    .CreateAsync(itemDto.FilePath,
                    itemDto.File,
                    hostingEnvironment.WebRootPath,
                    newOrderItem.Number);
            newOrderItem.FilePath = filePathWithFileName;

            await this.orderService.CreateAsync(newOrderItem);
            await this.orderService.SaveChangesAsync();

            var orderReadDto =
                AutoMapperConfig.MapperInstance.Map<OrderReadDto>(newOrderItem);

            return this
                .CreatedAtRoute(nameof(this.GetOrderById),
                new { Id = orderReadDto.Id },
                orderReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult>
        UpdateCommand(int id, [FromForm] OrderUpdateDto orderUpdateDto)
        {
            var orderItemFromRepo = await this.orderService.GetByIdAsync(id);

            if (orderItemFromRepo == null)
            {
                return this.NotFound();
            }

            FileService.Delete(hostingEnvironment.WebRootPath, orderItemFromRepo.FilePath);

            AutoMapperConfig.MapperInstance.Map<OrderUpdateDto, Order> (
                orderUpdateDto,
                orderItemFromRepo
            );

            var orderCategory =
                await this
                    .orderCategoryService
                    .GetByIdAsync<OrderCategoryReadDto>(orderItemFromRepo
                        .OrderCategoryId);
            orderItemFromRepo.FilePath =
                MAIN_ORDER_DIRECTORY + "\\" + orderCategory.Name;

            var filePathWithFileName =
                await FileService
                    .CreateAsync(orderUpdateDto.FilePath,
                    orderUpdateDto.File,
                    hostingEnvironment.WebRootPath,
                    orderUpdateDto.Number);
            orderItemFromRepo.FilePath = filePathWithFileName;

            this.orderService.Update(orderItemFromRepo);

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
            //string path = Path.Combine(hostingEnvironment.WebRootPath, orderItemFromRepo.FilePath);
            FileService
                .Delete(hostingEnvironment.WebRootPath,
                orderItemFromRepo.FilePath);

            return this.NoContent();
        }
    }
}
