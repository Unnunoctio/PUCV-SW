import { Modality, Position, Type, Website } from '../enums'
import type { LaborumContent, TrabajoConSentidoJobOffer } from '../spiders/types'

export class Job {
  website: Website
  position: Position
  url: string
  title: string | undefined
  modality: Modality | undefined
  type: Type | undefined
  company: string | undefined
  location: string | undefined
  date: Date | undefined
  description: string | undefined
  skills: string[]

  constructor (website: Website, position: Position, url: string) {
    this.website = website
    this.position = position
    this.url = url
    this.skills = []
  }

  isComplete (): boolean {
    return (
      this.title !== undefined &&
      this.modality !== undefined &&
      this.type !== undefined &&
      this.company !== undefined &&
      this.location !== undefined &&
      this.date !== undefined &&
      this.description !== undefined
    )
  }

  setLaborumData (data: LaborumContent): void {
    this.title = data.titulo
    this.company = data.empresa
    this.location = data.localizacion
    this.description = data.detalle

    // Date (dd-mm-yy)
    const date = data.fechaPublicacion.split('-')
    this.date = new Date(`${date[2]}-${date[1]}-${date[0]}`)

    // Type Full-time o Part-time
    this.type = (data.tipoTrabajo === 'Full-time') ? Type.FULL_TIME : Type.PART_TIME

    // Modality Presencial - Híbrido - Remoto
    switch (data.modalidadTrabajo) {
      case 'Presencial':
        this.modality = Modality.PRESENCIAL
        break
      case 'Híbrido':
        this.modality = Modality.HIBRIDO
        break
      case 'Remoto':
        this.modality = Modality.REMOTO
        break
    }
  }

  setTrabajoConSentidoData (data: TrabajoConSentidoJobOffer): void {
    this.title = data.title
    this.company = data.organization.name
    this.location = data.city
    this.description = data.description

    // Date
    const date = data.moderatedAt.split('T')
    this.date = new Date(date[0])

    // Type Completa
    this.type = (data.workingDay === 'Completa') ? Type.FULL_TIME : Type.PART_TIME

    // Modality Presencial - Semi-presencial - Remoto
    switch (data.workingMode) {
      case 'Presencial':
        this.modality = Modality.PRESENCIAL
        break
      case 'Semi-presencial':
        this.modality = Modality.HIBRIDO
        break
      case 'Remoto':
        this.modality = Modality.REMOTO
        break
    }
  }
}
