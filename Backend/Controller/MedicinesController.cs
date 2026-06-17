using Microsoft.AspNetCore.Mvc;
using MedicineApi.Models;
using System.Text.Json;

namespace MedicineApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicinesController : ControllerBase
    {
        private readonly string _filePath =
            Path.Combine(Directory.GetCurrentDirectory(),
            "Data", "medicines.json");

        [HttpGet]
        public IActionResult Get()
        {
            var json = System.IO.File.ReadAllText(_filePath);

            var medicines =
                JsonSerializer.Deserialize<List<Medicine>>(json);
            Console.WriteLine(_filePath);
            return Ok(medicines);
        }

        [HttpPost]
        public IActionResult AddMedicine([FromBody]Medicine medicine)
        {
            var json = System.IO.File.ReadAllText(_filePath);

            var medicines =
                JsonSerializer.Deserialize<List<Medicine>>(json)
                ?? new List<Medicine>();

            medicine.Id = medicines.Count > 0
                ? medicines.Max(x => x.Id) + 1
                : 1;

            medicines.Add(medicine);

            System.IO.File.WriteAllText(
                _filePath,
                JsonSerializer.Serialize(
                    medicines,
                    new JsonSerializerOptions
                    {
                        WriteIndented = true
                    }));

            return Ok(medicine);
        }
    }
}