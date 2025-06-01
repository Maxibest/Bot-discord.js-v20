const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('../handlers/commandHandler');

//Class Bot pour l'événement interactionCreate des commandes slash
class Bot {
    constructor(token) {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
        this.token = token;
        this.client.commands = new Collection();
        this.client.token = token;
        this._registerEvents();

    }
    //Fonction pour enregistrer les événements
    _registerEvents() {
        this.client.once('ready', () => {
            console.log(`Connecté en tant que ${this.client.user.tag}`);
        });

        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            const command = this.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Erreur lors de l\'exécution de la commande:', error);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
                }
            }
        });
    }

    async start() {
        // Chargement des commandes
        await loadCommands(this.client);

        // Connexion du bot
        await this.client.login(this.token);
    }
}

module.exports = Bot;
