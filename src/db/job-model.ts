import { model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { Modality, Position, Type, Website } from '../enums'
import type { JobDB } from '../types'

const JobSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  website: { type: String, required: true, enum: Object.values(Website), index: true },
  position: { type: String, required: true, enum: Object.values(Position), index: true },
  url: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  modality: { type: String, required: true, enum: Object.values(Modality), index: true },
  type: { type: String, required: true, enum: Object.values(Type), index: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  isPractice: { type: Boolean, required: true },
  description: { type: String, required: true }
}, {
  timestamps: true,
  versionKey: false
})

const JobModel = model<JobDB>('Job', JobSchema, 'jobs')
export default JobModel
