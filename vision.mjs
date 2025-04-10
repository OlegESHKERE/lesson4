import OpenAI from "openai";
import fs from "fs";
import 'dotenv/config';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const imageBase64 = fs.readFileSync("car1.jpg", { encoding: "base64" });

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
            text: `Проаналізуй зображення та:
1. Визнач колір автомобіля(ів).
2. Визнач державні номери (номерні знаки).
Виведи у форматі:
Колір: [колір]
Номер: [номер]`,
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
    console.log("Результат аналізу зображення:");
    console.log(completion.choices[0].message.content);
  } else {
    console.error("Порожня відповідь від моделі:", completion);
  }
} catch (err) {
  console.error("Помилка при запиті до OpenAI:", err);
}