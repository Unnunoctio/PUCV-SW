import type { Job } from '../../classes/Job'
import { Position } from '../../enums'

export class Trabajando {
  private readonly baseUrl = 'https://www.trabajando.cl/api/searchjob?orden=RANKING'

  private readonly headers = {
    Referer: 'https://www.trabajando.cl/trabajo-empleo'
  }

  public async run (): Promise<Job[]> {
    const allJobs: Job[] = []

    return allJobs
  }

  private getCareerQuery (position: Position): string {
    if (position === Position.PERIODISTA) return 'carreras=52&carreras=417'
    return ''
  }
}
