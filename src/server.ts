import App from '@/app'
import '@/config.server'
import { routes } from '@/routes/index'
import cluster from 'cluster'
import http from 'http'
import config from './config/default'

if (cluster.isPrimary) {
  // Master Process - HTTP Server Only
  const app = new App(routes)
  const server = http.createServer(app.getServer())

  server.listen(config.port, () => {
    console.log(`Master ${process.pid} listening on ${config.port}`)

    // Start workers after successful port binding
    const workerCount = config.razorpayWorkerCount || require('os').cpus().length
    for (let i = 0; i < workerCount; i++) {
      cluster.fork()
    }
  })

  server.on('error', error => {
    console.error('Master server error:', error)
    process.exit(1)
  })

  cluster.on('exit', worker => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`)
    cluster.fork()
  })
} else {
  // Worker Process - Kafka Only
  ;(async () => {
    try {
      if (config.nodeEnv == 'production') {
        const { startRazorpayRepaymentConsumer } = await import(
          '@/consumers/razorpay.repayment.consumer'
        )
        console.log(`Worker ${process.pid} Kafka consumer started before`)
        await startRazorpayRepaymentConsumer(process.pid)
        console.log(`Worker ${process.pid} Kafka consumer started after`)
      }
      // }
    } catch (error) {
      console.error(`Worker ${process.pid} failed:`, error)
      process.exit(1)
    }
  })()
}
