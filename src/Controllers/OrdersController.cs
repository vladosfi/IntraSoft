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
            var newOrderItem = AutoMapperConfig.MapperInstance.Map<Order>(itemDto);

            var categoryFromRepo = await this.orderCategoryService.GetByIdAsync<OrderCategoryReadDto>(itemDto.OrderCategoryId);

            var destPath = FileService.PathCombine(MAIN_ORDER_DIRECTORY,categoryFromRepo.Name);
            itemDto.FilePath = FileService.PathCombine(webRootPath, destPath);

            var filePathWithFileName = await FileService.CreateAsync(itemDto.File, itemDto.FilePath, itemDto.Number);
            
            newOrderItem.FilePath = FileService.PathCombine(destPath, FileService.GetFileName(filePathWithFileName));            

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
            var destPath = FileService.PathCombine(MAIN_ORDER_DIRECTORY,categoryFromQuery.Name);

            itemFromRepo.About = itemDto.About;
            itemFromRepo.Date = itemDto.Date;
            itemFromRepo.Number = itemDto.Number;
            


            if (itemDto.File != null)
            {
                FileService.Delete(webRootPath, itemFromRepo.FilePath);

                itemFromRepo.FilePath = FileService.PathCombine(webRootPath,destPath);
                var filePathWithFileName = await FileService.CreateAsync(itemDto.File, itemFromRepo.FilePath, itemFromRepo.Number);
                itemFromRepo.FilePath = FileService.PathCombine(destPath, FileService.GetFileName(filePathWithFileName));
            }
            else
            {
                if (itemFromRepo.OrderCategoryId != itemDto.OrderCategoryId)
                {
                    var fileName = FileService.GetFileName(itemFromRepo.FilePath);

                    var srcFile =  FileService.PathCombine(MAIN_ORDER_DIRECTORY, categoryFromRepo.Name);
                    srcFile =  FileService.PathCombine(srcFile,fileName);

                    var destFile = FileService.PathCombine(MAIN_ORDER_DIRECTORY, categoryFromQuery.Name);
                    destFile = FileService.PathCombine(destFile,fileName);

                    itemFromRepo.FilePath = destFile;

                    srcFile = FileService.PathCombine(webRootPath, srcFile);
                    destFile = FileService.PathCombine(webRootPath, destFile);
                    FileService.MoveFile(srcFile , destFile);
                }
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
