import mongoose from 'mongoose'
import { DB_URI } from './config'
import { Website } from './enums'
import { jobService } from './services/job-service'
import { Laborum, Trabajando, TrabajoConSentido } from './spiders/api'
import type { Spider } from './spiders/types'
import { Linkedin } from './spiders/web/Linkedin'

const runSpider = async (spider: Spider, spiderName: string): Promise<void> => {
  console.time(spiderName)
  const jobs = await spider.run()
  await jobService.saveManyJobs(jobs)
  console.timeEnd(spiderName)
}

const scraping = async (): Promise<void> => {
  console.log('Starting Scraping')
  try {
    // TODO: Connect to Database
    await mongoose.connect(DB_URI as string)
    console.log('Connected to Database')

    // TODO: Scraping
    console.log('Scraping Jobs')

    await runSpider(new Laborum(), Website.LABORUM)
    await runSpider(new Trabajando(), Website.TRABAJANDO)
    await runSpider(new TrabajoConSentido(), Website.TRABAJO_CON_SENTIDO)

    console.log('Scraping jobs finished')
  } catch (error) {
    console.log('An error occurred:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from Database')
  }
}

// First Scraping
// await scraping()

// Schedule Scraping at 6 AM every day
// scheduleJob('0 6 * * *', scraping)
// const urlPage = 'https://www.linkedin.com/jobs/search?keywords=Periodista&location=Chile&position=1&pageNum=0' // Total de jobs
// const urlApi = 'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Periodista&location=Chile&start=0' // recorrer los jobs
// const res = await fetch(urlApi)
// const body = await res.text()
// console.log(body)

console.time('Linkedin')
await new Linkedin().run()
console.timeEnd('Linkedin')
