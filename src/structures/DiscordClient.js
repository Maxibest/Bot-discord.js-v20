const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { loadEvents } = require('../handlers/eventHandler'); //Importation des événements 
const { loadCommands } = require('../handlers/commandHandler'); //Importation des commandes 

//class DiscordClient 
class DiscordClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });

        this.commands = new Collection();
        this.events = new Collection();
        this.config = {
            token: process.env.token,
            clientId: process.env.CLIENT_ID,
        };
    }

    async initialize() {
        try {
            if (!this.config.token || !this.config.clientId) {
                throw new Error('Missing required environment variables. Please check your .env file.');
            }

            // Chargement des événements
            console.log('📂 Loading events...');
            await loadEvents(this);
            
            // Chargement des commandes
            console.log('⚡ Loading commands...');
            await loadCommands(this);
            
            // Connexion
            console.log('🔑 Logging in...');
            await this.login(this.config.token);

            // Statistiques 
            this.once('ready', () => {
                console.log(`📊 Stats du bot:
                🤖 Nom: ${this.user.tag}
                🌐 Serveurs: ${this.guilds.cache.size}
                👥 Utilisateurs: ${this.users.cache.size}
                📝 Commandes: ${this.commands.size}`);
            });
        } catch (error) {
            console.error('❌ Error during initialization:', error);
            process.exit(1); // Si une erreur survient, on quitte le programme
        }
    }
}

module.exports = DiscordClient; 