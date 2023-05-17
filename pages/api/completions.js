import { Configuration, OpenAIApi } from 'openai'
import _ from '../../utils/proxy'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured, please follow instructions in README.md',
      }
    })
    return
  }

  const prompt = req.body.prompt || ''
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid prompt',
      }
    })
    return
  }

  try {

    let tokens = encode(prompt)
    let max_tokens = 4000 - tokens.length

    let params = {
      model: 'text-davinci-003',
      prompt,
      max_tokens,
      temperature: 0.6,
    }
    const response = await openai.createCompletion(params)
    res.status(200).json({
      params,
      result: response.data
    })

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      res.status(error.response.status).json(error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      })
    }
  }
}
