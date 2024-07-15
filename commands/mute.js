const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Réduire au silence')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Utilisateur à réduire au silence')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('duration')
        .setDescription('Durée du silence (en minutes)')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('raison')
        .setDescription('Raison du bannissement')
        .setRequired(false)),
  async execute(interaction) {
    const mutedUser = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('raison') || 'Aucune raison spécifiée';

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
      return await interaction.reply('Tu n\'as pas la permission d\'utiliser cette commande mon petit choubidou 😘');
    }

    const fetchMember = await interaction.guild.members.fetch(mutedUser.id);

    if (!fetchMember) {
      return await interaction.reply('Impossible de trouver ce membre');
    }

    try {
      await fetchMember.voice.setMute(true, reason);
      await interaction.reply(`Membre ${mutedUser.tag} a été réduit au silence pour ${duration} minutes. Raison: ${reason}`);

      if (duration) {
        setTimeout(async () => {
          await fetchMember.voice.setMute(false, 'Fin de la durée de silence');
          await interaction.followUp(`Membre ${mutedUser.tag} a été automatiquement rétabli après ${duration} minutes de silence.`);
        }, duration * 60000);
      }
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'exécution de la commande: ${error}`);
      await interaction.reply('Une erreur s\'est produite, appelle mon développeur 💀');
    }
  }
};
