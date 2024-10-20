import axios from 'axios'
import { sleep } from 'bun'
import { randomUserAgent } from './agent'

const RETRY_DELAY = 500

export const laborumFetch = async (url: string, headers: any, body: string): Promise<any | undefined> => {
  const agent = randomUserAgent()
  headers['User-Agent'] = agent

  try {
    const { data } = await axios.post(url, body, { headers })
    return data
  } catch (error) {
    console.error('Error in fetching data from Laborum:', url)
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
    console.error('Error in fetching data from Trabajando:', url)
    return undefined
  }
}

export const trabajoConSentidoFetch = async (url: string, headers: any): Promise<any | undefined> => {
  const agent = randomUserAgent()
  headers['User-Agent'] = agent

  try {
    const { data } = await axios.get(url, { headers })
    return data
  } catch (error) {
    console.error('Error in fetching data from TrabajoConSentido:', url)
    return undefined
  }
}

export const linkedinFetch = async (url: string): Promise<string> => {
  const agent = randomUserAgent()

  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': agent } })
    return data
  } catch (error) {
    const delay = RETRY_DELAY * (Math.floor(Math.random() * 5) + 1)
    await sleep(delay)
    return await linkedinFetch(url)
  }
}
