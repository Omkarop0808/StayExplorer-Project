require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const res = await model.generateContent("Say hi in one funny line.");
  console.log(res.response.text());
}

main().catch(console.error);


