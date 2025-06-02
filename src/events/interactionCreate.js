
//Class intactionCreate pour l'intéraction des événements
class InteractionCreateEvent {
    constructor() {
        this.name = 'interactionCreate';
    }

    async execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la commande:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: 'Une erreur est survenue lors de l\'exécution de cette commande.',
                    ephemeral: true 
                });
            }
        }
    }
}

module.exports = new InteractionCreateEvent();
