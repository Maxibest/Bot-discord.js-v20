//class GuildCreateEvent pour l'événement guildCreate
class GuildCreateEvent {
    constructor() {
        this.name = 'guildCreate';
    }

    async execute(guild) {
        console.log(`🎉 Bot ajouté au serveur: ${guild.name}`);
        console.log(`👥 Membres: ${guild.memberCount}`);
        console.log(`👑 Propriétaire: ${guild.ownerId}`);

        // Envoyer un message dans le premier canal texte disponible
        const channel = guild.channels.cache.find(
            channel => channel.type === 0 && channel.permissionsFor(guild.members.me).has('SendMessages')
        );

        if (channel) {
            await channel.send({
                content: 'Merci de m\'avoir ajouté à votre serveur! 👋\nUtilisez `/help` pour voir la liste des commandes disponibles.'
            }).catch(console.error);
        }
    }
}

module.exports = new GuildCreateEvent(); 