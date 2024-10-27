import mongoose from 'mongoose'
import { scheduleJob } from 'node-schedule'
import { DB_URI } from './config'
import { Website } from './enums'
import { jobService } from './services/job-service'
import { Laborum, Trabajando, TrabajoConSentido } from './spiders/api'
import type { Spider } from './spiders/types'
import { Linkedin } from './spiders/web'

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
    // await runSpider(new Linkedin(), Website.LINKEDIN) // Preguntar Community Manager

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
await scraping()

// Schedule Scraping at 6 AM every day
scheduleJob('0 6 * * *', scraping)
