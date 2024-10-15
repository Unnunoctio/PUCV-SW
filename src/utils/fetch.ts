import { sleep } from 'bun'
import { randomUserAgent } from './agent'

// const MAX_RETRIES = 5
const RETRY_DELAY = 100

export const linkedinFetch = async (url: string): Promise<string | undefined> => {
  while (true) {
    const agent = randomUserAgent()
    const res = await fetch(url, { headers: { 'User-Agent': agent } })
    if (res.ok) return await res.text()
    await sleep(RETRY_DELAY * (Math.floor(Math.random() * 10) + 1))
  }
  // for (let i = 0; i < MAX_RETRIES; i++) {
  //   const agent = randomUserAgent()
  //   const res = await fetch(url, { headers: { 'User-Agent': agent } })
  //   if (res.ok) return await res.text()
  //   await sleep(RETRY_DELAY)
  // }
  // console.log(`${url} 5 retries`)
  // return undefined
}
