import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/page.module.css'

let messages = [{
  role: 'system',
  content: 'You are a helpful assistant.'
}]

export default function Page() {
  console.log('messages:', messages)
  const [chat, setChat] = useState(messages)
  const [question, setQuestion] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [params, setParams] = useState('')
  const [result, setResult] = useState()

  async function onSubmit(event) {
    event.preventDefault()
    try {
      setParams('')
      setRequesting(true)

      messages.push({
        role: 'user',
        content: question
      })
      setChat(messages)
      setQuestion('')
      setParams(`messages:\n${JSON.stringify(messages, null, '  ')}`)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      })

      const data = await response.json()
      if (response.status !== 200) {
        throw data || new Error(`Request failed with status ${response.status}`)
      }
      messages.push(data.result.choices[0].message)
      setChat(messages)
      setParams(`openai.createChatCompletion(${JSON.stringify(data.params, null, '  ')})`)
      setResult(`result:\n${JSON.stringify(data.result, null, '  ')}`)
      setRequesting(false)
    } catch (error) {
      setResult(`result:\n${JSON.stringify(error, null, '  ')}`)
      setRequesting(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Chat - OpenAI API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>Chat</h3>
        {
          chat.map((message, idx) => (
            <p key={idx} className={styles.pre}>
              <span className={styles.role}>{message.role}:</span> {message.content}
            </p>
          ))
        }
        <form onSubmit={onSubmit}>
          <span className={requesting ? styles.hide : styles.role}>user:</span>
          <textarea
            name="question"
            className={requesting ? styles.hide : ''}
            rows="5"
            placeholder="Enter question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div>
            <input type="submit" value="call" disabled={!!requesting}/>
          </div>
        </form>
        <pre>{params}</pre>
        <pre>{requesting ? 'requesting...' : result}</pre>
      </main>
    </div>
  )
}
