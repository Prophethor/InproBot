module.exports = {
    aliases: ['clear'],
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: '<number>',
    requiredPermisions: 'MANAGE_MESSAGES',
    permissionError: "You don't have permision to manage messages.",
    callback: (message, arguments, text) => {
        let ammount = 100;
        if(arguments[0]){
            if(isNaN(arguments[0])){
                message.reply(`Incorrect syntax! Please use yo clear <number>`)
                return
            } else {
                ammount = arguments[0]
            }
        }
        message.channel.bulkDelete(ammount).then(messages => {
            message.channel.send(`Successfully deleted ${messages.size} messages.`)
        })
    }
}