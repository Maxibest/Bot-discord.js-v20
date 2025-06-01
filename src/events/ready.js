//Class ready pour l'événement ready
class ReadyEvent {
    constructor() {
        this.name = 'ready';
        this.once = true;
    }

    async execute(client) {
        console.log(`✅ ${client.user.tag} is online and ready!`);
        
        // Set bot activity
        client.user.setActivity('with Discord.js', { type: 'PLAYING' });
    }
}

module.exports = new ReadyEvent(); 