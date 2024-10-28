import * as cheerio from 'cheerio'
import { Modality, Position, Type, Website } from '../enums'
import type { LaborumContent, TrabajandoJobResponse, TrabajoConSentidoJobOffer } from '../spiders/types'

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
  isPractice: boolean = false
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

  setPractice (): void {
    if (this.title === undefined) return

    const normalizedTitle = this.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const titleArray = normalizedTitle.match(/\b[a-zA-Z]+\b/g) ?? []
    const matchArray = new Set(['practica', 'practicas', 'practicante'])

    this.isPractice = titleArray.some(word => matchArray.has(word))
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

    // Practice
    this.setPractice()
  }

  setTrabajandoData (data: TrabajandoJobResponse): void {
    this.title = data.nombreCargo
    this.company = data.nombreEmpresaFantasia
    this.location = data.ubicacion.direccion
    this.description = `${data.descripcionOferta}\n ${data.requisitosMinimos}`

    // Date (yy-mm-dd)
    this.date = new Date(data.fechaPublicacionFormatoIngles)

    // Type Part Time -> Otro
    this.type = (data.nombreJornada === 'Part Time') ? Type.PART_TIME : Type.FULL_TIME

    // Modality Jornada Completa - Mixta (Teletrabajo + Presencial) - Teletrabajo
    switch (data.nombreJornada) {
      case 'Jornada Completa':
        this.modality = Modality.PRESENCIAL
        break
      case 'Mixta (Teletrabajo + Presencial)':
        this.modality = Modality.HIBRIDO
        break
      case 'Teletrabajo':
        this.modality = Modality.REMOTO
        break
      default:
        this.modality = Modality.PRESENCIAL
        break
    }

    // Practice
    this.setPractice()
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

    // Practice
    this.setPractice()
  }

  setLinkedinHTML (html: string, date: Date, modality: Modality): void {
    this.date = date
    this.modality = modality

    const $ = cheerio.load(html)
    this.title = $('.top-card-layout__title').text().trim()
    this.company = $('.topcard__org-name-link').text().trim()
    this.location = $('.topcard__flavor.topcard__flavor--bullet').text().trim()

    // Type (Jornada completa, Media jornada, Contrato por obra, Temporal, Voluntario)
    const items = $('.description__job-criteria-text.description__job-criteria-text--criteria')
    const type = items.eq(1).text().trim()
    if (type === 'Media jornada' || type === 'Voluntario') this.type = Type.PART_TIME
    else this.type = Type.FULL_TIME

    // Description
    const desc = $('.description__text.description__text--rich .show-more-less-html__markup').html()?.trim()
    this.description = desc

    // Practice
    this.setPractice()
  }
}
