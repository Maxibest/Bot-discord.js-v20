const fs = require('fs').promises;
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

//Variables d'environnement
const token = process.env.token;    
const clientId = process.env.CLIENT_ID;

//Si les variables d'environnement sont manquantes, on quitte le programme
if (!token || !clientId) {
    throw new Error('Missing required environment variables. Please check your .env file.');
}

//Function loadCommands pour charger les commandes
async function loadCommands(client) {
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

    const rest = new REST({ version: '10' }).setToken(client.config.token);

    try {
        console.log(`Started refreshing ${commandsArray.length} application (/) commands.`);

        try {
            await rest.put(
                Routes.applicationCommands(client.config.clientId),
                { body: commandsArray }
            );
            console.log('✅ Successfully registered commands globally');
        } catch (error) {
            if (!client.config.clientId) throw error; // pas de clientId => on ne peut pas faire l'enregistrement par serveur
            console.log('⚠️ Global registration failed, trying guild-specific registration...');
            await rest.put(
                Routes.applicationGuildCommands(client.config.clientId),
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