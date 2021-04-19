const redis = require('./redis')

module.exports = () => {
    return await new Promise((resolve, reject) => {
        const client = redis.createClient({
            url: process.env.REDIS_PATH
        })

        client.on('error', (err) => {
            console.error('Redis error: ', err)
            client.quit()
            reject(err)
        })

        client.on('ready', () => {
            resolve(client)
        })
    })
}