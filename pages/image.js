import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/page.module.css'

export default function Page() {
  const [prompt, setPrompt] = useState('A cute baby orange cat.')
  const [params, setParams] = useState('')
  const [result, setResult] = useState()
  const [url, setUrl] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    try {
      setParams('')
      setResult('requesting ...')

      const response = await fetch('/api/image', {
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

      setParams(`openai.createImage(${JSON.stringify(data.params, null, '  ')})`)
      setResult(`result:\n${JSON.stringify(data.result, null, '  ')}`)
      setUrl(data.result.data[0].url)
    } catch(error) {
      setResult(`result:\n${JSON.stringify(error, null, '  ')}`)
    }
  }

  return (
    <div>
      <Head>
        <title>Image - OpenAI API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>Image</h3>
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
        <p>
          <img className={styles.image} src={url} />
        </p>
      </main>
    </div>
  )
}
