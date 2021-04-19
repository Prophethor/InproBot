module.exports = {
    aliases: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    requiredPermissions: [],
    requiredRoles: [],
    permissionError: 'You need admin permissions to run this command',
    roleError: 'You need to be math genius',
    minArgs: 2,
    maxArgs: 2,
    callback: (message, arguments, text) => {
        message.reply(`Sum of those is ${parseInt(arguments[0])+parseInt(arguments[1])}`)
    }
}