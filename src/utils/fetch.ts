import axios from 'axios'
import { sleep } from 'bun'
import { randomUserAgent } from './agent'

// const MAX_RETRIES = 5
const RETRY_DELAY = 100

export const laborumFetch = async (url: string, headers: any, body: string): Promise<any | undefined> => {
  const agent = randomUserAgent()
  headers['User-Agent'] = agent

  try {
    const { data } = await axios.post(url, body, { headers })
    return data
  } catch (error) {
    console.log('Error in fetching data from Laborum:', error)
    return undefined
  }
}

export const trabajandoFetch = async (url: string, headers: any): Promise<any | undefined> => {
  const agent = randomUserAgent()
  headers['User-Agent'] = agent

  try {
    const { data } = await axios.get(url, { headers })
    return data
  } catch (error) {
    console.log('Error in fetching data from Trabajando:', error)
    return undefined
  }
}

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
