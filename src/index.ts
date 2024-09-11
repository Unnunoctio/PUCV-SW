import mongoose from 'mongoose'
import { DB_URI } from './config'
import type { Job } from './classes/Job'
import { jobService } from './services/job-service'
import { Laborum, TrabajoConSentido } from './spiders/api'

async function main (): Promise<void> {
  console.log('Starting Scraping')
  try {
    // TODO: Connect to Database
    await mongoose.connect(DB_URI as string)
    console.log('Connected to Database')

    // TODO: Scraping
    const allJobs: Job[] = []
    const laborumJobs = await new Laborum().run()
    const sentidoJobs = await new TrabajoConSentido().run()
    allJobs.push(...laborumJobs, ...sentidoJobs)

    // TODO: Save Jobs
    await jobService.saveManyJobs(allJobs)
  } catch (error) {
    console.log('An error occurred:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from Database')
  }
}

// TODO: Run the main function
main().then(() => {
  console.log('Process completed successfully')
  process.exit(0)
}).catch((error) => {
  console.error('Process failed:', error)
  process.exit(1)
})
