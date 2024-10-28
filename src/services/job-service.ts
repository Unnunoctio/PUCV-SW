import type { Job } from '../classes/Job'
import JobModel from '../db/job-model'

// TODO: Save
const saveManyJobs = async (jobs: Job[]): Promise<void> => {
  const jobsToSave = jobs.filter(job => job.isComplete())

  try {
    const updateOperations = jobsToSave.map(job => ({
      updateOne: {
        filter: { url: job.url },
        update: {
          $set: {
            website: job.website,
            position: job.position,
            url: job.url,
            title: job.title,
            modality: job.modality,
            type: job.type,
            company: job.company,
            location: job.location,
            date: job.date,
            isPractice: job.isPractice,
            description: job.description
          }
        },
        upsert: true
      }
    }))

    await JobModel.bulkWrite(updateOperations)
  } catch (error) {
    console.log('Error saving jobs', error)
  }
}

export const jobService = {
  saveManyJobs
}
