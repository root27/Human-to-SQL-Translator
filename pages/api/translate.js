import fetch from "isomorphic-unfetch";

const translateToSQL = async (query, apiKey) => {
  let prompt = `Translate this natural language query into SQL:\n\n"${query}"\n\nSQL Query:`;
  
  console.log(prompt);
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      temperature: 0.5,
      max_tokens: 2048,
      n: 1,
      stop: "\n",
      model: "text-davinci-003",
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      logprobs: 10,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.log(response);
    throw new Error(data.error || "Error translating to SQL.");
  }

  return data.choices[0].text.trim();
};


if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not defined in .env file. Please add it there (see README.md for more details)."
    );
  }

export default async function handler (req,res) {
    const {inputText} = req.body;

    try {
        const result = await translateToSQL(
          inputText,
          process.env.OPENAI_API_KEY,
          
        );
        // console.log(res);
        res.status(200).json({ outputText: result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error translating to SQL" });
      }


}