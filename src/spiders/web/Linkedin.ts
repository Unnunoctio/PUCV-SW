import * as cheerio from 'cheerio'
import { Job } from '../../classes/Job'
import { Modality, Position, Website } from '../../enums'
import { linkedinFetch } from '../../utils/fetch'
import type { Spider } from '../types'

export class Linkedin implements Spider {
  private readonly pageUrl = 'https://www.linkedin.com/jobs/search?location=Chile&position=1&pageNum=0'
  private readonly jobsUrl = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?location=Chile'

  public async run (): Promise<Job[]> {
    const allJobs: Job[] = []
    for (const position of Object.values(Position)) {
      console.log(position)
      for (const modality of Object.values(Modality)) {
        // Obtener las urls de paginas
        const pages = await this.getPages(position, modality)
        // Obtener los jobs de cada pagina
        const jobs = (await Promise.all(pages.map(async (page) => {
          return await this.getJobs(page, position, modality)
        }))).flat()

        allJobs.push(...jobs)
      }
    }
    console.log('alljobs:', allJobs.length)
    return []
  }

  private async getPages (position: Position, modality: Modality): Promise<string[]> {
    let fwt = 1 // 1 = Presencial, 2 = Remoto, 3 = Hibrido
    if (modality === Modality.REMOTO) fwt = 2
    if (modality === Modality.HIBRIDO) fwt = 3

    const url = `${this.pageUrl}&keywords=${position}&f_WT=${fwt}`
    const body = await linkedinFetch(url)
    if (body === undefined) return []

    const $ = cheerio.load(body)

    const jobsCount = Number($('.results-context-header__job-count').text())
    const totalPages = Math.ceil(jobsCount / 10)

    return Array.from({ length: totalPages }, (_, i) => `${this.jobsUrl}&keywords=${position}&f_WT=${fwt}&start=${i * 10}`)
  }

  private async getJobs (page: string, position: Position, modality: Modality): Promise<Job[]> {
    const body = await linkedinFetch(page)
    if (body === undefined) return []

    const $ = cheerio.load(body)

    const jobsItems: Array<{ date: Date, link: string }> = []
    $('.base-card').each((_, elem) => {
      let link = $(elem).find('.base-card__full-link').attr('href')
      if (link === undefined) link = $(elem).attr('href')

      let dateTxt = $(elem).find('.job-search-card__listdate').attr('datetime')
      if (dateTxt === undefined) dateTxt = $(elem).find('.job-search-card__listdate--new').attr('datetime')

      if (link !== undefined && dateTxt !== undefined) jobsItems.push({ date: new Date(dateTxt as string), link })
    })

    const jobs = await Promise.all(jobsItems.map(async jobItem => {
      const jobHtml = await linkedinFetch(jobItem.link)
      if (jobHtml === undefined) return undefined

      const job = new Job(Website.LINKEDIN, position, jobItem.link)
      job.setLinkedinHTML(jobHtml, jobItem.date, modality)
      return job
    }))

    return jobs.filter(job => job !== undefined)
  }
}
