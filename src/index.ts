import { Laborum } from './spiders/api/Laborum'
import { TrabajoConSentido } from './spiders/api/TrabajoConSentido'

console.log('Hello via Bun!')

// const res = await fetch('https://api.trabajoconsentido.com/offers?tags=psicologo', {
//   method: 'GET',
//   headers: {
//     // Referer: 'https://www.trabajando.cl/trabajo-empleo'
//     // 'X-Site-Id': 'BMCL',
//     // 'Content-Type': 'application/json'
//   }
//   // body: JSON.stringify({
//   //   query: 'periodista'
//   // })
// })

// const data = await res.json()

// console.log(data)

// console.log(Object.values(Position).map(position => ({
//   query: position
// })))

const laborumJobs = await new Laborum().run()
const sentidoJobs = await new TrabajoConSentido().run()
console.log(laborumJobs)
console.log(sentidoJobs)
