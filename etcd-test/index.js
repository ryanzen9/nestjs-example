import { Etcd3 } from 'etcd3';
const client = new Etcd3({
    hosts: 'http://10.0.5.134:2379',
});

// 配置中心
export class ConfigCenter {

    static pub = async () => {
        await client.put('/services/a').value('service a');
        await client.put('/services/b').value('service b');
        await client.put('/services/c').value('service c');
    }

    static get = async () => {
    const services = await client.get('/services/a').string();
    console.log('service A:', services);

    const allServices = await client.getAll().prefix('/services').keys();
    console.log('all services:', allServices);

    const watcher = await client.watch().key('/services/a').create();
    watcher.on('put', (req) => {
        console.log('put', req.value.toString())
    })
    watcher.on('delete', (req) => {
        console.log('delete')
    })
    }

}
// 注册中心
export class ServiceRegistry {
    // 服务注册
    static registerService = async (name, instance, metadata) => {
        const key = `/services/${name}/${instance}`;
        const lease = client.lease(10); // 10 seconds TTL
        await lease.put(key).value(JSON.stringify(metadata));
        lease.on('lost', async (err) => {
            console.log(`租约过期，正在重新注册服务 ${name} 实例 ${instance}...`);
            console.log('Lease lost due to error:', err);
            await ServiceRegistry.registerService(name, instance, metadata); // Re-register on lease loss
        });
    }

    // 服务发现
    static discoverService = async (name) => {
        const instances = await client.getAll().prefix(`/services/${name}/`).keys();
        const values = await client.getAll().prefix(`/services/${name}/`).strings();

        return instances.map((key, index) => ({
            instance: key.split('/').pop(),
            metadata: JSON.parse(values[key])
        }));
    }

    // 服务监听
    static async  watchService(serviceName, callback) {
        const watcher = await client.watch().prefix(`/services/${serviceName}`).create();
        watcher.on('put', async event => {
            console.log('新的服务节点添加:', event.key.toString());
            callback(await ServiceRegistry.discoverService(serviceName));
        }).on('delete', async event => {
            console.log('服务节点删除:', event.key.toString());
            callback(await ServiceRegistry.discoverService(serviceName));
        });
    }
}


const main = async () => {
    const serviceName = 'my-service';

    await ServiceRegistry.registerService(serviceName, 'instance1', { host: 'localhost', port: 8080 });
    await ServiceRegistry.registerService(serviceName, 'instance2', { host: 'localhost', port: 8081 });

    const instances = await ServiceRegistry.discoverService(serviceName);
    console.log('Discovered instances:', instances);

    ServiceRegistry.watchService(serviceName, (updatedInstances) => {
        console.log('Updated instances:', updatedInstances);
    });

    // 模拟服务实例变更
    setTimeout(async () => {
        await client.delete().key(`/services/${serviceName}/instance1`);
    }, 5000);

}


main();
