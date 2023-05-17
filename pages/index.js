import Head from "next/head"
import Link from 'next/link'
import styles from "../styles/index.module.css"

export default function Home() {
  return (
    <div>
      <Head>
        <title>OpenAI API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <img src="/gear.svg" className={styles.icon} />
        <h3>OpenAI API</h3>
        <ul>
          <li><Link href="/completions" target="_blank">Completions</Link></li>
          <li><Link href="/chat" target="_blank">Chat</Link></li>
          <li><Link href="/image" target="_blank">Image</Link></li>
        </ul>
      </main>
    </div>
  )
}
