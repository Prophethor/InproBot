const prefix = "!"

const validatePermissions = (permissions) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]
  
    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}"`)
        }
    }
}

let allAliases = {}

module.exports = (commandOptions) => {
    let {
        aliases,
        permissions = []
    } = commandOptions

    if(typeof aliases === 'string') {
        aliases = [aliases]
    }

    console.log(aliases[0])

    if(permissions.length) {
        if(typeof permissions === 'string') {
            permissions = [permissions]
        }
        validatePermissions(permissions)
    }

    for(const command of aliases){
        allAliases[command] = {
            ...commandOptions,
            aliases,
            permissions
        }
    }
}

module.exports.listen = (client) => {
    client.on('message', message => {
        const {member, content, guild} = message
        const arguments = content.split(/[ ]+/)
        const name = arguments.shift().toLowerCase()
        if(name.startsWith(prefix)) {
            const command = allAliases[name.replace(prefix,'')]
            if(!command) {
                return
            }

            const {
                requiredPermissions=[],
                permissionError="You don't have required permissions.",
                requiredRoles = [],
                roleError="You don't have required roles.",
                minArgs = 0,
                maxArgs = null,
                expectedArgs = "",
                callback
            } = command

            for(const permission of requiredPermissions) {
                if(!member.hasPermission(permission)){
                    message.reply(permissionError)
                    return
                }
            }

            for(const requiredRole of requiredRoles){
                const role = guild.role.cache.find(role => {
                    role.name === requiredRole
                
                    if(!role || !member.roles.cache.has(role.id)){
                        message.reply(roleError)
                        return
                    }
                })
            }

            if(arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)){
                message.reply(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
                return
            }

            callback(message, arguments, arguments.join(' '))
        }
    })
}