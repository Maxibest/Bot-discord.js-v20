require('dotenv').config();
const fs = require('fs')

const { Client, Collection } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const montoken = process.env.token;

const client = new Client({ intents: 3276799 });

const commandHandler = new Collection();

const commands = []

//Commandes Handlers "variables"
const rest = new REST({ version: '9' }).setToken(montoken);
const mesCommands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const commandEvents = fs.readdirSync("./Events").filter(file => file.endsWith(".js"));

//Commande Handler moderation and slashcommands
for (const file of mesCommands) {
  const commandName = file.split(".")[0]
  const command = require(`./commands/${commandName}`)
  commandHandler.set(commandName, command)
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${command} is missing a required "data" or "execute" property.`);
  }
}
//Commande Handler Evenements and SlashCommand
for (const file of commandEvents) {
  const commandName = file.split(".")[0]
  const command = require(`./Events/${commandName}`)
  commandHandler.set(commandName, command)
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${command} is missing a required "data" or "execute" property.`);
  }
}

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log('Je suis ready')
})

client.on("messageCreate", async (message) => {
  if (message.content === "salut") {
    message.react("👋").then(console.log).catch(console.error);
  } else {
    if (message.content === "Salut") {
      message.react("👋").then(console.log).catch(console.error);
    } else {
      if (message.content === "Bonjour") {
        message.react("👋").then(console.log).catch(console.error);
      } else {
        if (message.content === "bonjour") {
          message.react("👋").then(console.log).catch(console.error);
        }
      }
    }
  }
});

//interactionCreate
const commandes = [
  require('./commands/unban'),
  require('./commands/kick'),
  require('./commands/ban'),
  require('./commands/purge'),
  require('./commands/tempban'),
  require('./commands/mute'),
  require('./commands/snipe'),
  require('./Events/hugs'),
  require('./Events/punch'),
  require('./Events/kiss')
];

const commandMap = new Map();
commandes.forEach(command => commandMap.set(command.data.name, command));

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commandMap.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'An error occurred while executing the command.' });
  }
});

client.on('messageDelete', async message => {
  const snipeCommand = commandMap.get('snipe');
  if (snipeCommand) {
    await snipeCommand.saveDeletedMessage(message);
  }
});

client.login(process.env.token);