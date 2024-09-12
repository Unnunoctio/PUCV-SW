import mongoose from 'mongoose'
import { scheduleJob } from 'node-schedule'
import { DB_URI } from './config'
import type { Job } from './classes/Job'
import { jobService } from './services/job-service'
import { Laborum, Trabajando, TrabajoConSentido } from './spiders/api'

const scraping = async (): Promise<void> => {
  console.log('Starting Scraping')
  try {
    // TODO: Connect to Database
    await mongoose.connect(DB_URI as string)
    console.log('Connected to Database')

    // TODO: Scraping
    const allJobs: Job[] = []
    console.log('Scraping Jobs')
    console.time('Laborum')
    const laborumJobs = await new Laborum().run()
    console.timeEnd('Laborum')
    console.time('Trabajando')
    const trabajandoJobs = await new Trabajando().run()
    console.timeEnd('Trabajando')
    console.time('Trabajo con Sentido')
    const sentidoJobs = await new TrabajoConSentido().run()
    console.timeEnd('Trabajo con Sentido')
    allJobs.push(...laborumJobs, ...trabajandoJobs, ...sentidoJobs)

    // TODO: Save Jobs
    await jobService.saveManyJobs(allJobs)
    console.log('Jobs saved successfully')
  } catch (error) {
    console.log('An error occurred:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from Database')
  }
}

// const test = async (): Promise<void> => {
//   console.log('test schedule')
//   console.log(new Date())
// }

// scheduleJob('*/1 * * * *', test)
scheduleJob('0 6 * * *', scraping)
