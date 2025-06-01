//class GuildDeleteEvent pour l'événement guildDelete
class GuildDeleteEvent {
    constructor() {
        this.name = 'guildDelete';
    }

    execute(guild) {
        console.log(`😢 Bot retiré du serveur: ${guild.name}`);
        console.log(`🆔 ID du serveur: ${guild.id}`);
        
    }
}

module.exports = new GuildDeleteEvent(); 