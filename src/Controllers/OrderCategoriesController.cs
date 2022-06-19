namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.OrderCategory;
    using IntraSoft.Services.Data;
    using IntraSoft.Services.Data.OrderCategory;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class OrderCategoriesController : ControllerBase
    {
        private readonly IOrderCategoryService orderCategoryService;

        public OrderCategoriesController(IOrderCategoryService orderCategoryService)
        {
            this.orderCategoryService = orderCategoryService;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orderCategoriesReadDto = await this.orderCategoryService.GetAllAsync<OrderCategoryReadDto>();

            if (orderCategoriesReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(orderCategoriesReadDto);
        }

    }
}