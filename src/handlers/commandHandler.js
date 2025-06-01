const fs = require('fs').promises;
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

//Function loadCommands pour charger les commandes
async function loadCommands(client, token, clientId, guildId) {
    const commandsArray = [];
    const commandFiles = await fs.readdir(path.join(__dirname, '../commands'));
    
    for (const file of commandFiles) {
        if (!file.endsWith('.js')) continue;
        
        const command = require(`../commands/${file}`);
        const commandName = file.split('.')[0];
        
        if (!command.data || typeof command.data.toJSON !== 'function') {
            console.log(`⚠️ Command ${commandName} is missing required 'data' property or toJSON method`);
            continue;
        }
        
        client.commands.set(commandName, command);
        commandsArray.push(command.data.toJSON());
        console.log(`💫 Command loaded: ${commandName}`);
    }

    if (commandsArray.length === 0) {
        console.log('⚠️ No commands found to register');
        return;
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log(`Started refreshing ${commandsArray.length} application (/) commands.`);

        try {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commandsArray }
            );
            console.log('✅ Successfully registered commands globally');
        } catch (error) {
            if (!guildId) throw error; // pas de guildId => on ne peut pas faire l'enregistrement par serveur
            console.log('⚠️ Global registration failed, trying guild-specific registration...');
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commandsArray }
            );
            console.log('✅ Successfully registered commands for specific guild');
        }
    } catch (error) {
        console.error('Error while registering commands:', error);
        if (error.code === 50035) {
            console.error('Invalid form body error. Command structure might be invalid.');
            commandsArray.forEach((cmd, index) => {
                console.log(`Command ${index + 1}:`, JSON.stringify(cmd, null, 2));
            });
        }
    }
}

module.exports = { loadCommands }; 