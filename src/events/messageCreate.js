//Class MessageCreate pour l'événement messageCreate
class MessageCreateEvent {
    constructor() {
        this.name = 'messageCreate';
        this.greetings = ['salut', 'Salut', 'bonjour', 'Bonjour'];
    }

    async execute(message) {
        if (message.author.bot) return;

        const content = message.content.toLowerCase();
        if (this.greetings.includes(content)) {
            try {
                await message.react('👋');
            } catch (error) {
                console.error('Error while reacting to message:', error);
            }
        }
    }
}

module.exports = new MessageCreateEvent(); 