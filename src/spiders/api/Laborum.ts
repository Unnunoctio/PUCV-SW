import { Job } from '../../classes/Job'
import { Position, Website } from '../../enums'
import { laborumFetch } from '../../utils/fetch'
import type { LaborumResponse, Spider } from '../types'

export class Laborum implements Spider {
  private readonly baseUrl = 'https://www.laborum.cl/api/avisos/searchV2?pageSize=100&sort=RECIENTES'
  private readonly jobBaseUrl = 'https://www.laborum.cl/empleos/'

  private readonly headers = {
    Referer: 'https://www.laborum.cl/empleos-busqueda.html?recientes=true',
    'X-Site-Id': 'BMCL',
    'Content-Type': 'application/json'
  }

  public async run (): Promise<Job[]> {
    const allJobs: Job[] = []
    for (const position of Object.values(Position)) {
      // Obtener las urls de paginas
      const pages = await this.getPages(position)
      // Obtener los jobs de cada pagina
      const jobs = (await Promise.all(pages.map(async (page) => {
        return await this.getJobs(page, position)
      }))).flat()

      allJobs.push(...jobs)
    }

    return allJobs
  }

  private async getPages (position: Position): Promise<string[]> {
    const data: LaborumResponse = await laborumFetch(this.baseUrl, this.headers, JSON.stringify({ query: position }))

    const total = Math.ceil(data.totalSearched / data.size)
    const pages = Array.from({ length: total }, (_, i) => `${this.baseUrl}&page=${i}`)
    return pages
  }

  private async getJobs (page: string, position: Position): Promise<Job[]> {
    const data: LaborumResponse = await laborumFetch(page, this.headers, JSON.stringify({ query: position }))

    const jobs = data.content.map(c => {
      const productUrl = `${this.jobBaseUrl}${c.id}`
      const job = new Job(Website.LABORUM, position, productUrl)
      job.setLaborumData(c)
      return job
    })

    return jobs
  }
}
