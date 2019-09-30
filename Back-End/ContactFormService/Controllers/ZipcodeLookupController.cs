using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ContactFormService.Services;
using ContactFormService.Models;

namespace ContactFormService.Controllers
{
    [Route("api/zipcode-lookup")]
    public class ZipcodeLookupController : Controller
    {

        private readonly ZipcodeLookupService _service;

        public ZipcodeLookupController(ZipcodeLookupService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ZipcodeLookupRequestWrapper> GetZipcode([FromBody] ZipcodeLookupRequestWrapper request)
        {
            var requestXml = request.RequestXml;
            var zipInfo = await _service.GetZipcodeInfo(requestXml);

            return new ZipcodeLookupRequestWrapper()
            {
                RequestXml = zipInfo
            };
        }
    }
}
