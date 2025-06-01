const { SlashCommandBuilder } = require('discord.js');
const Command = require('../structures/Command');


class PingCommand extends Command {
    constructor() {
        super({
            name: 'ping',
            description: 'Répond avec Pong!',
            category: 'utility'
        });

        this.data = new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Répond avec Pong!')
            .setDMPermission(false);
    }

    async execute(interaction) {
        try {
            const sent = await interaction.reply({ 
                content: 'Pinging...', 
                fetchReply: true 
            });

            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            
            await interaction.editReply({
                content: `🏓 Pong!\n⏱️ Latence: ${latency}ms\n🌐 API: ${interaction.client.ws.ping}ms`
            });
        } catch (error) {
            console.error('Error in ping command:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: 'Une erreur est survenue lors de l\'exécution de cette commande.',
                    ephemeral: true
                });
            }
        }
    }
}

module.exports = new PingCommand(); 