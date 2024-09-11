import type { Website, Position, Modality, Type } from './enums'

export interface JobDB extends Job {
  _id: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Job {
  website: Website
  position: Position
  url: string
  title: string
  modality: Modality
  type: Type
  company: string
  location: string
  date: Date
  description: string
}
