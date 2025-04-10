import OpenAI from "openai";
import 'dotenv/config';


const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const stream = await openai.chat.completions.create({
  model: "openai/gpt-4o-mini",
  stream: true,
  messages: [
    {
      role: "system",
      content: "Ти чарівний казкар. Вигадуй добрі історії українською мовою.",
    },
    {
      role: "user",
      content: `Придумай коротку казку про хороброго лицаря, який вирушає в небезпечну подорож, щоб врятувати королівство. Закінчи казку моральним висновком.`,
    },
  ],
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
