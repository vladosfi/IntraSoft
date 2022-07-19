namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.ErrorLog;
    using IntraSoft.Services.Data.ErrorLogs;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class ErrorLogsController : ControllerBase
    {
        private readonly IErrorLogService errorLogService;

        public ErrorLogsController(IErrorLogService errorLogService)
        {
            this.errorLogService = errorLogService;
        }

        //// GET: api/<ErrorLogsController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var errorLogsReadDto = await this.errorLogService.GetAllAsync<ErrorLogReadDto>();

            if (errorLogsReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(errorLogsReadDto);
        }

        // GET api/<ErrorLogsController>/5
        [HttpGet("{id}", Name = nameof(GetErrorLogById))]
        public async Task<ActionResult<ErrorLogReadDto>> GetErrorLogById(int id)
        {
            var items = await this.errorLogService.GetByIdAsync<ErrorLogReadDto>(id);

            if (items == null)
            {
                return this.NotFound();
            }

            return this.Ok(items);
        }

        // DELETE api/<ErrorLogsController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var itemsFromRepo = await this.errorLogService.GetByIdAsync(id);

            if (itemsFromRepo == null)
            {
                return this.NotFound();
            }

            this.errorLogService.Delete(itemsFromRepo);
            await this.errorLogService.SaveChangesAsync();

            return this.NoContent();
        }
    }
}