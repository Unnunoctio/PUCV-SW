import { Job } from '../../classes/Job'
import { Position, Website } from '../../enums'
import type { LaborumResponse } from '../types'

export class Laborum {
  private readonly baseUrl = 'https://www.laborum.cl/api/avisos/searchV2?pageSize=100&sort=RECIENTES'

  private readonly headers = {
    Referer: 'https://www.laborum.cl/empleos-busqueda.html?recientes=true',
    'X-Site-Id': 'BMCL',
    'Content-Type': 'application/json'
  }

  public async run (): Promise<Job[]> {
    const allJobs: Job[] = []
    for (const position of Object.values(Position)) {
      const pages = await this.getPages(position)
      const jobs = (await Promise.all(pages.map(async (page) => {
        return await this.getJobs(page, position)
      }))).flat()

      console.log(position)
      console.log(jobs)
    }

    return allJobs
  }

  private async getPages (position: Position): Promise<string[]> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ query: position })
    })
    const data: LaborumResponse = await res.json()

    const total = Math.ceil(data.totalSearched / data.size)
    const pages = Array.from({ length: total }, (_, i) => `${this.baseUrl}&page=${i}`)
    return pages
  }

  private async getJobs (page: string, position: Position): Promise<Job[]> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ query: position })
    })
    const data: LaborumResponse = await res.json()

    const jobs = data.content.map(c => {
      const job = new Job(Website.LABORUM, position)
      job.setLaborumData(c)
      return job
    })

    return jobs
  }
}
