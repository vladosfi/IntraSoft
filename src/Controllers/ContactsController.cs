namespace IntraSoft.Controllers
{
    using System.Threading.Tasks;
    using IntraSoft.Data.Dtos.Contact;
    using IntraSoft.Data.Models;
    using IntraSoft.Services.Data;
    using IntraSoft.Services.Mapping;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService contactService;

        public ContactsController(IContactService contactService)
        {
            this.contactService = contactService;
        }

        //// GET: api/<ValuesController>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contactsReadDto = await this.contactService.GetAllAsync<ContactReadDto>();

            if (contactsReadDto == null)
            {
                return this.NoContent();
            }

            return this.Ok(contactsReadDto);
        }

        // GET api/<ValuesController>/5
        [HttpGet("{id}", Name = nameof(GetContactById))]
        public async Task<ActionResult<ContactReadDto>> GetContactById(int id)
        {
            var contactItems = await this.contactService.GetByIdAsync<ContactReadDto>(id);

            if (contactItems == null)
            {
                return this.NotFound();
            }

            return this.Ok(contactItems);
        }

        // POST api/<ValuesController>
        [HttpPost]
        public async Task<ActionResult<ContactCreateDto>> Post([FromBody] ContactCreateDto contactItemDto)
        {
            var newContactItem = AutoMapperConfig.MapperInstance.Map<Contact>(contactItemDto);

            await this.contactService.CreateAsync(newContactItem);

            await this.contactService.SaveChangesAsync();
            var contactReadDto = AutoMapperConfig.MapperInstance.Map<ContactReadDto>(newContactItem);


            return this.CreatedAtRoute(
                nameof(this.GetContactById),
                new { Id = contactReadDto.Id },
                contactReadDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCommand(int id, ContactUpdateDto contactUpdateDto)
        {
            var contactItemFromRepo = await this.contactService.GetByIdAsync(id);

            if (contactItemFromRepo == null)
            {
                return this.NotFound();
            }

            AutoMapperConfig.MapperInstance.Map<ContactUpdateDto, Contact>(contactUpdateDto,contactItemFromRepo);

            this.contactService.Update(contactItemFromRepo);
            await this.contactService.SaveChangesAsync();

            return this.NoContent();
        }

        // DELETE api/<ValuesController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var contactItemFromRepo = await this.contactService.GetByIdAsync(id);

            if (contactItemFromRepo == null)
            {
                return this.NotFound();
            }

            this.contactService.Delete(contactItemFromRepo);
            await this.contactService.SaveChangesAsync();

            return this.NoContent();
        }
    }
}