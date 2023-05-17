import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/page.module.css'

export default function Page() {
  const [prompt, setPrompt] = useState('')
  const [params, setParams] = useState('')
  const [result, setResult] = useState()

  async function onSubmit(event) {
    event.preventDefault()
    try {
      setParams('')
      setResult('requesting ...')

      const response = await fetch('/api/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
      }

      setParams(`openai.createCompletion(${JSON.stringify(data.params, null, '  ')})`)
      setResult(`result:\n${JSON.stringify(data.result, null, '  ')}`)
      setPrompt(prompt + data.result.choices[0].text)
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  return (
    <div>
      <Head>
        <title>Completions - OpenAI API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>Completions</h3>
        <form onSubmit={onSubmit}>
          <textarea
            name="prompt"
            rows="10"
            placeholder="Enter prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div>
            <input type="submit" value="call" />
          </div>
        </form>
        <pre>{params}</pre>
        <pre>{result}</pre>
      </main>
    </div>
  )
}
