import Nacos from 'nacos'

const client = new Nacos.NacosNamingClient({
    serverList: ['10.0.5.134:8848'],
    namespace: 'public',
    logger: console
})

await client.ready()

const aaaServiceName = 'aaaService'

const instance1 =  {
    ip: '127.0.0.1',
    port: 8080
}

await client.registerInstance(aaaServiceName, instance1)

const instance2 =  {
    ip: '127.0.0.1',
    port: 8081
}

await client.registerInstance(aaaServiceName, instance2)


async function cleanup() {
  try {
    await client.deregisterInstance(aaaServiceName, instance1)
    await client.deregisterInstance(aaaServiceName, instance2)
  } finally {
    process.exit(0)
  }
}

process.on('SIGINT', () => {
  cleanup()
})

process.on('SIGTERM', () => {
  cleanup()
})
