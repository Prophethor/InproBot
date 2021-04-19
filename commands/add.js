module.exports = {
    commands: ['add', 'addition'],
    expectedArgs: '<num1> <num2>',
    permissions: [],
    requiredRoles: [],
    permissionError: 'You need admin permissions to run this command',
    minArgs: 2,
    maxArgs: 2,
    callback: (message, arguments, text) => {
        message.reply(`Sum of those is ${parseInt(arguments[0])+parseInt(arguments[1])}`)
    }
}