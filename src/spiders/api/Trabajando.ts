import { Job } from '../../classes/Job'
import { Position, Website } from '../../enums'
import { trabajandoFetch } from '../../utils/fetch'
import type { Spider, TrabajandoJobResponse, TrabajandoResponse } from '../types'

export class Trabajando implements Spider {
  private readonly baseUrl = 'https://www.trabajando.cl/api/searchjob?orden=RANKING'
  private readonly offerBaseUrl = 'https://www.trabajando.cl/api/ofertas/'
  private readonly jobBaseUrl = 'https://www.trabajando.cl/trabajo-empleo/'

  private readonly headers = {
    Referer: 'https://www.trabajando.cl/trabajo-empleo'
  }

  public async run (): Promise<Job[]> {
    const allJobs: Job[] = []
    for (const position of Object.values(Position)) {
      // Obtener las urls de paginas
      const pages = await this.getPages(position)
      // Obtener las urls de cada pagina
      const offers = (await Promise.all(pages.map(async (page) => {
        return await this.getOffers(page)
      }))).flat()
      // Obtener los jobs de cada oferta
      const jobs = (await Promise.all(offers.map(async (url) => {
        return await this.getJob(url, position)
      }))).flat()

      allJobs.push(...jobs.filter(job => job !== undefined))
    }

    return allJobs
  }

  private getCareerQuery (position: Position): string {
    if (position === Position.PERIODISTA) return 'carreras=52' // Periodismo
    if (position === Position.COMUNICADOR) return 'carreras=21&carreras=20' // Comunicación Social / Empresarial y Comunicación Audiovisual y/o Multimedia
    if (position === Position.PUBLICISTA) return 'carreras=135&carreras=308&carreras=307' // Publicidad, Marketing y Publicidad profesional mención marketing y medios
    if (position === Position.RELACIONADOR_PUBLICO) return 'carreras=60' // Relaciones Públicas
    return ''
  }

  private async getPages (position: Position): Promise<string[]> {
    const url = `${this.baseUrl}&palabraClave=${position}&${this.getCareerQuery(position)}`
    const data: TrabajandoResponse | undefined = await trabajandoFetch(url, this.headers)
    if (data === undefined) return []

    const total = data.cantidadPaginas
    const pages = Array.from({ length: total }, (_, i) => `${url}&pagina=${i + 1}`)
    return pages
  }

  private async getOffers (page: string): Promise<string[]> {
    const data: TrabajandoResponse | undefined = await trabajandoFetch(page, this.headers)
    if (data === undefined) return []

    const urls: string[] = []
    for (const offer of data.ofertas) {
      urls.push(`${this.offerBaseUrl}${offer.idOferta}`)
    }
    return urls
  }

  private async getJob (url: string, position: Position): Promise<Job | undefined> {
    const data: TrabajandoJobResponse | undefined = await trabajandoFetch(url, this.headers)
    if (data === undefined) return undefined

    const productUrl = `${this.jobBaseUrl}${position.replaceAll(' ', '%20')}/trabajo/${data.idOferta}`
    const job = new Job(Website.TRABAJANDO, position, productUrl)
    job.setTrabajandoData(data)
    return job
  }
}
