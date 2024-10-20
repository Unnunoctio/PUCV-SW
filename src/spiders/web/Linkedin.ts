import * as cheerio from 'cheerio'
import { Job } from '../../classes/Job'
import { Modality, Position, Website } from '../../enums'
import { linkedinFetch } from '../../utils/fetch'
import type { Spider } from '../types'

interface Link {
  date: Date
  url: string
  modality: Modality
}

export class Linkedin implements Spider {
  private readonly pageUrl = 'https://www.linkedin.com/jobs/search?location=Chile&position=1&pageNum=0'
  private readonly jobsUrl = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?location=Chile'

  public async run (): Promise<Job[]> {
    const allJobs: Job[] = []
    for (const position of Object.values(Position)) {
      const positionLinks: Link[] = []
      console.log(position)
      for (const modality of Object.values(Modality)) {
        // Obtener las urls de paginas
        const pages = await this.getPages(position, modality)
        // Obtener los links de los jobs
        const links = (await Promise.all(pages.map(async (page) => {
          return await this.getLinks(page, modality)
        }))).flat()

        positionLinks.push(...links)
      }

      // Obtener los jobs de cada link
      const jobs = (await Promise.all(positionLinks.map(async (link) => {
        return await this.getJob(link, position)
      }))).flat()

      allJobs.push(...jobs.filter(job => job !== undefined))
    }
    console.log('alljobs:', allJobs.length)
    return allJobs
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

  private async getLinks (page: string, modality: Modality): Promise<Link[]> {
    const body = await linkedinFetch(page)
    if (body === undefined) return []

    const $ = cheerio.load(body)

    const links: Link[] = []
    $('.base-card').each((_, elem) => {
      let link = $(elem).find('.base-card__full-link').attr('href')
      if (link === undefined) link = $(elem).attr('href')

      let dateTxt = $(elem).find('.job-search-card__listdate').attr('datetime')
      if (dateTxt === undefined) dateTxt = $(elem).find('.job-search-card__listdate--new').attr('datetime')

      if (link !== undefined && dateTxt !== undefined) links.push({ date: new Date(dateTxt), url: link, modality })
    })

    return links
  }

  private async getJob (link: Link, position: Position): Promise<Job | undefined> {
    const body = await linkedinFetch(link.url)
    if (body === undefined) return undefined

    const job = new Job(Website.LINKEDIN, position, link.url)
    job.setLinkedinHTML(body, link.date, link.modality)
    return job
  }
}
