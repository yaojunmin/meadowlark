const cluster = require('cluster')

function startWorker() {
  const worker = cluster.fork()
  console.log('cluster:worker' + worker.id + 'started')
}

// 主进程
if (cluster.isMaster) {
  require('os').cpus().forEach(startWorker)

  cluster.on('disconnect', worker => console.log(`cluster:worker ${worker.id} disconnected from the cluster`))

  cluster.on('exit', (worker, code, signal) => {
    console.log(`cluster:worker ${worker.id} died with exit code ${code} (${signal})`)
    startWorker()
  })
} else {
  const port = process.env.PORT || 3000
  require('./meadowlark')(port)
}