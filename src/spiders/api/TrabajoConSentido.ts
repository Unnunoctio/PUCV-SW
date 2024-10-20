import { Job } from '../../classes/Job'
import { Position, Website } from '../../enums'
import { trabajoConSentidoFetch } from '../../utils/fetch'
import type { Spider, TrabajoConSentidoJobResponse, TrabajoConSentidoResponse } from '../types'

export class TrabajoConSentido implements Spider {
  private readonly baseUrl = 'https://api.trabajoconsentido.com/offers'
  private readonly offerBaseUrl = 'https://api.trabajoconsentido.com/offers/slug'
  private readonly jobBaseUrl = 'https://listado.trabajoconsentido.com/trabajos/'

  private readonly headers = {}

  public async run (): Promise<Job[]> {
    const allJobs: Job[] = []
    for (const position of Object.values(Position)) {
      // Genera la url de la page (no tiene formato de paginas)
      const page = `${this.baseUrl}?tags=${position.replaceAll(' ', ',')}`
      // Obtener las urls de cada oferta
      const offers = await this.getOffers(page)
      // Obtener los jobs de cada oferta
      const jobs = (await Promise.all(offers.map(async (url) => {
        return await this.getJob(url, position)
      }))).flat()

      allJobs.push(...jobs.filter(job => job !== undefined))
    }

    return allJobs
  }

  private async getOffers (page: string): Promise<string[]> {
    const data: TrabajoConSentidoResponse | undefined = await trabajoConSentidoFetch(page, this.headers)
    if (data === undefined) return []

    const urls: string[] = []
    for (const offer of data.content.offers) {
      urls.push(`${this.offerBaseUrl}/${offer.slug}`)
    }
    return urls
  }

  private async getJob (url: string, position: Position): Promise<Job | undefined> {
    const data: TrabajoConSentidoJobResponse | undefined = await trabajoConSentidoFetch(url, this.headers)
    if (data === undefined) return undefined

    const productUrl = `${this.jobBaseUrl}${data.content.offer.slug}`
    const job = new Job(Website.TRABAJO_CON_SENTIDO, position, productUrl)
    job.setTrabajoConSentidoData(data.content.offer)
    return job
  }
}
