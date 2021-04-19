const redis = require('./redis')
const command = require('./command')
const { Channel } = require('discord.js')
const { RedisClient } = require('redis')

module.exports = client => {

    const redisKeyPrefix = 'muted-'
    
    const giveRole = member => {
        const role = member.guild.roles.cache.find(role => role.name === "Muted")
        if(role) {
            member.roles.add(role)
            console.log("User is muted")
        }
    }

    client.on('guildMemberAdd', member => {
        const {id} = member

        const redisClient = await redis()
        try {
            redisClient.get(`${redisKeyPrefix}${id}`, (err, result) => {
                if(err) {
                    console.error('Redis GET error:', err)
                } else if (result) {
                    giveRole(member)
                } else {
                    console.log("User is not muted")
                }
            })
        } finally {
            redisClient.quit()
        }
    })

    command(client, 'mute', async (message) => {
        const syntax = 'yo mute <@> <duration as a number> <m, h, d or life>'

        const {member,channel, content, mentions, guild} = message
        if(!member.hasPermission('ADMINISTRATOR')){
            channel.send('You do not have permission to run this command.')
            return
        }

        const split = content.trim().split(' ')
        //yo mute @ 10 h
        if(split.length !== 5) {
            channel.send('Please use the correct command syntax: ' + syntax)
            return
        }

        const duration = split[3]
        const durationType = split[4]
        if(isNaN(duration) || duration <= 0){
            channel.send('Please provide a positive number for the duration. ' + syntax)
            return
        }

        const durations = {
            m: 60,
            h: 60 * 60,
            d: 24 * 60 * 60,
            life: -1
        }

        if(!durations[durationType]){
            channel.send('Please provide a valid duration type. ' + syntax)
            return
        }

        const seconds = duration * durations[durationType]

        const target = mentions.users.first()
        if(!target) {
            channel.send('Please tag a user to mure.')
            return
        }
        const { id } = target

        const targetMember = guild.members.cache.get(id)
        giveRole(targetMember)

        const redisClient = await redis()
        try {
            const redisKey = `${redisKeyPrefix}${id}`
            if(seconds < 0){
                redisClient.set(redisKey,'true')
            } else {
                redisClient.set(redisKey, 'true', 'EX', seconds)
            }
            
        } catch(err) {
            console.error(err)
        } finally {
            redisClient.quit()
        }

        

    })
}