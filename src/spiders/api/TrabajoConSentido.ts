import { Job } from '../../classes/Job'
import { Position, Website } from '../../enums'
import type { TrabajoConSentidoJobResponse, TrabajoConSentidoResponse } from '../types'

export class TrabajoConSentido {
  private readonly baseUrl = 'https://api.trabajoconsentido.com/offers'
  private readonly offerBaseUrl = 'https://api.trabajoconsentido.com/offers/slug'
  // private readonly headers = {}

  public async run (): Promise<Job[]> {
    const allJobs: Job[] = []
    for (const position of Object.values(Position)) {
      // Genera la url de la page (no tiene formato de paginas)
      const page = `${this.baseUrl}?tags=${position}`
      // Obtener las urls de cada oferta
      const offers = await this.getOffers(page)
      // Obtener los jobs de cada oferta
      const jobs = (await Promise.all(offers.map(async (url) => {
        return await this.getJob(url, position)
      }))).flat()

      allJobs.push(...jobs)
    }

    return allJobs
  }

  private async getOffers (page: string): Promise<string[]> {
    const res = await fetch(page)
    const data: TrabajoConSentidoResponse = await res.json()

    const urls: string[] = []
    for (const offer of data.content.offers) {
      urls.push(`${this.offerBaseUrl}/${offer.slug}`)
    }
    return urls
  }

  private async getJob (url: string, position: Position): Promise<Job> {
    const res = await fetch(url)
    const data: TrabajoConSentidoJobResponse = await res.json()

    const job = new Job(Website.TRABAJO_CON_SENTIDO, position)
    job.setTrabajoConSentidoData(data.content.offer)
    return job
  }
}
