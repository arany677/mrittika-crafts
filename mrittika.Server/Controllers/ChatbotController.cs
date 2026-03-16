using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Net.Http;

namespace mrittika.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatbotController : ControllerBase
    {
        // 1. Using the STABLE API Key you provided
        private const string ApiKey = "PASTE_YOUR_KEY_HERE";

        // 2. FIXED URL: Using 'v1' and 'gemini-pro' (Most stable version)
        private const string GeminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + ApiKey;

        [HttpPost("ask")]
        public async Task<IActionResult> AskGemini([FromBody] ChatRequest request)
        {
            if (string.IsNullOrEmpty(request.Message)) return BadRequest();

            try
            {
                using var client = new HttpClient();
                client.Timeout = TimeSpan.FromSeconds(20);

                // SYSTEM PROMPT: Giving the AI its identity
                string context = "You are the AI for 'Mrittika', an online pottery shop. You represent rural artisans. " +
                                 "Rules: 1. Buying: Use cart and Cash on Delivery. 2. Selling: Artisans must register. " +
                                 "3. Tone: Warm and professional. 4. If asked about Biryani, say you only know pottery!";

                var payload = new
                {
                    contents = new[] {
                new { parts = new[] { new { text = $"{context}\n\nUser Question: {request.Message}" } } }
            }
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(GeminiUrl, content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    using var doc = JsonDocument.Parse(responseString);
                    // This pulls the text from the 2.5 Flash response structure
                    var aiText = doc.RootElement.GetProperty("candidates")[0]
                                               .GetProperty("content")
                                               .GetProperty("parts")[0]
                                               .GetProperty("text").GetString();

                    return Ok(new { response = aiText });
                }

                // If it fails, we see exactly why in the Chat
                return Ok(new { response = "Google Error: " + response.StatusCode });
            }
            catch (Exception ex)
            {
                return Ok(new { response = "Connection Error: " + ex.Message });
            }
        }

        // Move this class outside to avoid 'Duplicate Definition' errors
        public class ChatRequest
        {
            public string Message { get; set; } = string.Empty;
        }
    }
}