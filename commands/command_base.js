const prefixes = ["yo ", "!"]

/*  
Command information:
aliases - list of strings
requiredPermissions - string or list of strings
permissionError - string
requiredRoles - string or list of strings
roleError - string
minArgs - number
maxArgs - number
expectedArgs - string
callback - method
*/

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
        requiredPermissions = []
    } = commandOptions

    if(typeof aliases === 'string') {
        aliases = [aliases]
    }

    console.log(`Detected command: ${aliases[0]}`)

    if(requiredPermissions.length) {
        if(typeof requiredPermissions === 'string') {
            requiredPermissions = [requiredPermissions]
        }
        validatePermissions(requiredPermissions)
    }

    for(const command of aliases){
        allAliases[command] = {
            ...commandOptions,
            aliases,
            requiredPermissions
        }
    }
}

module.exports.listen = (client) => {
    client.on('message', message => {
        const {member, content, guild} = message
        prefixes.forEach(prefix => {
            const regex = new RegExp(prefix + '\\w+\\s*')
            const nameArray = content.match(regex)
            if(!nameArray) {
                return
            }
            const name = nameArray[0].trim()
            
            if(content.startsWith(name)){
                const alias = allAliases[name.slice(prefix.length)]
                if(!alias) {
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
                } = alias
                for(const permission of requiredPermissions) {
                    if(!member.hasPermission(permission)){
                        message.reply(permissionError)
                        return
                    }
                }
                for(const requiredRole of requiredRoles){
                    const role = guild.role.cache.find(role => {
                        role.name === requiredRole
                    })
                    if(!role || !member.roles.cache.has(role.id)){
                        message.reply(roleError)
                        return
                    }
                }
                const arguments = content.slice(prefix.length).split(/[ ]+/)
                arguments.shift()
                if(arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)){
                    message.reply(`Incorrect syntax! Use ${name} ${expectedArgs}`)
                    return
                }
                console.log(`Running command: ${name.slice(prefix.length)}`)
                callback(message, arguments, arguments.join(' '))
            }
        })
    })
}