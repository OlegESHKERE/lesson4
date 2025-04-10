import OpenAI from "openai";
import fs from "fs";
import 'dotenv/config';

// Створення інстансу OpenAI з ключем API
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Зчитування зображення у base64
const imageBase64 = fs.readFileSync("QR_code1.png", { encoding: "base64" });

try {
  const completion = await openai.chat.completions.create({
    model: "google/gemini-pro-vision",
    messages: [
      {
        role: "system",
        content: "Ти корисний асистент. Відповідай українською мовою.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Будь ласка, розпізнай QR-код на зображенні та виведи інформацію, яка в ньому закодована.`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
  });

  if (completion.choices?.length) {
    console.log("Результат розпізнавання QR-коду:");
    console.log(completion.choices[0].message.content);
  } else {
    console.error("Порожня відповідь від моделі:", completion);
  }
} catch (err) {
  console.error("Помилка при запиті до OpenAI:", err);
}
