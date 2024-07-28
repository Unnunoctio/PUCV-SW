
// ? LABORUM
export interface LaborumResponse {
  number: number
  size: number
  total: number
  content: LaborumContent[]
  filters: LaborumFilter[]
  filtersApplied: LaborumFiltersApplied[]
  totalSearched: number
  homeList: null
}

export interface LaborumContent {
  id: number
  titulo: string
  detalle: string
  aptoDiscapacitado: boolean
  idEmpresa?: number
  empresa: string
  confidencial: boolean
  logoURL: null | string
  fechaHoraPublicacion: string
  fechaPublicacion: string
  planPublicacion: LaborumPlanPublicacion
  portal: string
  tipoTrabajo: string
  idPais: number
  idArea: number
  idSubarea: number
  leido: null
  visitadoPorPostulante: null
  localizacion: string
  cantidadVacantes: number
  guardado: null
  gptwUrl: null
  match: null
  promedioEmpresa?: number | null
  modalidadTrabajo: string
  tipoAviso: string
}

export interface LaborumPlanPublicacion {
  id: number
  nombre: string
}

export interface LaborumFilter {
  type: string
  facets: LaborumFacet[]
}

export interface LaborumFacet {
  id: string
  idSemantico: string
  name: string
  quantity: number
}

export interface LaborumFiltersApplied {
  id: string
  value: string
}

// ? TRABAJANDO.CL
export interface TrabajandoResponse {
  estado: string
  ofertas: TrabajandoOferta[]
  cantidadRegistros: number
  cantidadPaginas: number
  paginaActual: number
  registrosPorPagina: number
}

export interface TrabajandoOferta {
  idOferta: number
  nombreCargo: string
  urlLogo: string
  nombreEmpresa: string
  descripcionOferta: string
  publicadoHace: string
  ubicacion: string
  ofertaDestacada: boolean
  geolocalizacion: string
  nombreJornada: string
  ofertaInclusiva: boolean
  sueldo: null
}

export interface TrabajandoJobResponse {
  idOferta: number
  idEmpresa: number
  ofertaConfidencial: boolean
  nombreCargo: string
  nombreTipoCargo: string
  descripcionOferta: string
  cantidadVacantes: number
  nombreEmpresaFantasia: string
  categorias: any[]
  nombreArea: string
  tiempoContrato: string
  nombreJornada: string
  mostrarSueldo: boolean
  nombreMoneda: string
  sueldo: number
  nombreOperadorExperiencia: string
  aniosExperiencia: number
  nombreNivelAcademico: string
  nombreSituacionAcademica: string
  requisitosMinimos: string
  ofertaInclusiva: boolean
  fechaPublicacion: string
  fechaExpiracion: string
  fechaPublicacionFormatoIngles: Date
  fechaExpiracionFormatoIngles: Date
  urlLogo: string
  finalizaEn: string
  publicadoHace: string
  carreras: TrabajandoJobCarrera[]
  instituciones: TrabajandoJobInstitucione[]
  idiomas: any[]
  habilidades: any[]
  ubicacion: TrabajandoJobUbicacion
  indicadorAtractivo: TrabajandoJobIndicadorAtractivo
  archivosAdjuntos: any[]
  evaluacionesInternasOnline: any[]
  evaluaciones: any[]
  documentosRequeridos: any[]
  linkPostulacionExterno: null
  postulacionValidaInstitucion: boolean
  candidadPostulaciones: number
  candidadVisualizaciones: number
  tipoCurriculumAceptado: string
  exclusiva: boolean
  estadoOferta: string
  usaScoreScreening: boolean
}

export interface TrabajandoJobCarrera {
  nombreCarrera: string
}

export interface TrabajandoJobIndicadorAtractivo {
  texto: string
  color: string
  icono: string
  tipoIcono: string
}

export interface TrabajandoJobInstitucione {
  idInstitucion: number
  idInstitucionSqlServer: number
  nombreInstitucion: string
}

export interface TrabajandoJobUbicacion {
  nombrePais: string
  nombreRegion: string
  nombreComuna: string
  direccion: string
  codigoPostal: string
  coordenadas: TrabajandoJobCoordenadas
}

export interface TrabajandoJobCoordenadas {
  type: string
  coordinates: number[]
}
