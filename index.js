const Discord = require('discord.js');
const client = new Discord.Client();
const command = require('./command');
const firstMessage = require('./first_message')
const privateMessage = require('./private_message')
const roleClaim = require('./role_claim')
const poll = require('./poll')
const tempMessage = require('./temp_message')
const mongo = require('./mongo')

client.on('ready', async ()=>{
    console.log('The client is ready!')

    roleClaim(client)
    poll(client)

    command(client, 'avatar', (message) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Your avatar is`)
            .setImage(message.author.displayAvatarURL())
        message.channel.send(embed)
    })

    command(client, 'ban', (message) => {
        const { member, mentions } = message
        const tag = `<@${member.id}>`
        if(member.hasPermission('ADMINISTRATOR')
        || member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first();
            if(target){
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.ban()
                message.channel.send(`${tag} That user has been banned.`)
            } else {
                message.channel.send(`${tag} Please specify target to ban.`)
            }
        } else {
            message.channel.send(
                `${tag} You don't have a permission to use this command.`
            )
        }
    })

    command(client, 'servers', (message) => {
        client.guilds.cache.forEach((guild) => {
            message.channel.send(`${guild.name} has a total of ${guild.memberCount} members`);
        })
    })

    command(client, 'clearchannel', (message) => {
        message.channel.messages.fetch().then((results) => {
            message.channel.bulkDelete(results);
        })
    })

    command(client, 'status', message => {
        const content = message.content.replace('yo status ', '')
        client.user.setPresence({
            activity: {
                name: content,
                type:0,
            },
        })
    })

    command(client, 'createvoicechannel', (message) => {
        const content = message.content.replace('yo createvoicechannel ', '')
        message.guild.channels.create(content, {
            type: 'voice'
        }).then((channel) => {
            channel.setUserLimit(10)
        })
    })

    command(client, 'serverinfo', (message) => {
        const { guild } = message
        const { name, region, memberCount, afkTimeout } = guild
        const icon = guild.iconURL()

        const embed = new Discord.MessageEmbed()
            .setTitle(`Server info for ${name}`)
            .setThumbnail(icon)
            .addFields(
            {
                name: 'Region',
                value: region
            },
            {
                name: 'Members',
                value: memberCount
            },
            {
                name: 'AFK Timeout',
                value: afkTimeout
            },)

        message.channel.send(embed)
    })
})

client.login(process.env.BOT_TOKEN)