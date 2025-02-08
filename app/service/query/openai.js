import axios from "axios"
import { OPENAI_API_KEY, MODEL, MAX_TOKENS, TEMPERATURE } from "../../../config/aiConfig" 

async function fetchAdvice(formData) {
  const prompt = `
    L'utente ha bisogno di un consiglio per: ${formData.tipo_attrezzo}.
    Altri dettagli: ...
  `;

  const response = await axios.post('https://api.openai.com/v1/completions', {
    model: MODEL,
    prompt,
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
  }, {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  });

  return response.data.choices[0].text;
}

module.exports = { fetchAdvice };