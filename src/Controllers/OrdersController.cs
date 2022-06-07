namespace IntraSoft.Controllers
{
    using System;
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Order;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService orderService;

        public OrdersController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ordersReadDto = await this.orderService.GetAllAsync<OrderReadDto>();

            if (ordersReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(ordersReadDto);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}", Name = nameof(GetOrderById))]
        public async Task<ActionResult<OrderReadDto>> GetOrderById(int id)
        {
            var orderItems = await this.orderService.GetByIdAsync<OrderReadDto>(id);

            if (orderItems == null)
            {
                return this.NotFound();
            }

            return this.Ok(orderItems);
        }

        // POST api/<ValuesController>
        [HttpPost]
        //public async Task<ActionResult<OrderCreateDto>> Post([FromBody] OrderCreateDto orderItemDto)
        public async Task<ActionResult<OrderCreateDto>> Post([FromForm] OrderCreateDto orderItemDto)
        {
            var newOrderItem = AutoMapperConfig.MapperInstance.Map<Order>(orderItemDto);

            await this.orderService.CreateAsync(newOrderItem);

            await this.orderService.SaveChangesAsync();
            var orderReadDto = AutoMapperConfig.MapperInstance.Map<OrderReadDto>(newOrderItem);

            

            return this.CreatedAtRoute(
                nameof(this.GetOrderById),
                new { Id = orderReadDto.Id },
                orderReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, OrderUpdateDto orderUpdateDto)
        {
            var orderItemFromRepo = await this.orderService.GetByIdAsync(id);

            if (orderItemFromRepo == null)
            {
                return this.NotFound();
            }

            AutoMapperConfig.MapperInstance.Map<OrderUpdateDto, Order>(orderUpdateDto, orderItemFromRepo);
            
            this.orderService.Update(orderItemFromRepo);

            await this.orderService.SaveChangesAsync();

            return this.NoContent();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var orderItemFromRepo = await this.orderService.GetByIdAsync<Order>(id);

            if (orderItemFromRepo == null)
            {
                return this.NotFound();
            }

            this.orderService.Delete(orderItemFromRepo);
            await this.orderService.SaveChangesAsync();

            return this.NoContent();
        }
    }
}