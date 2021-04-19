const path = require('path')
const fs = require('fs')
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', async ()=>{
    console.log('The client is ready!')

    const baseFile = 'command_base.js'
    const commandBase = require(`./commands/${baseFile}`)
    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files){
            const stat = fs.lstatSync(path.join(__dirname,dir,file))
            if(stat.isDirectory()){
                readCommands(path.join(dir,file))
            } else if (file !== baseFile) {
                const options = require(path.join(__dirname, dir, file))
                commandBase(options)
            }
        }
    }
    readCommands('commands')
    commandBase.listen(client)
})

client.login(process.env.BOT_TOKEN)