import { Configuration, OpenAIApi } from "openai";
import axios from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'

// SET SOCKS5_PROXY=socks5h://127.0.0.1:7080
let socksProxy
if (process.env.SOCKS5_PROXY) {
  console.log('SOCKS5_PROXY:', process.env.SOCKS5_PROXY)
  socksProxy = new SocksProxyAgent(process.env.SOCKS5_PROXY)
}

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (socksProxy) {
    config = {
      ...config,
      httpsAgent: socksProxy
    }
  }
  return config;
}, function (error) {
  // Do something with request error
  console.log('axios.interceptors:', error)
  return Promise.reject(error);
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
