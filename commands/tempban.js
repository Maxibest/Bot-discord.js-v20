const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban-temporaire')
    .setDescription('Bannir un membre temporairement')
    .addUserOption(option =>
      option
        .setName('cible')
        .setDescription('Membre à bannir')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('duration')
        .setDescription('Durée du bannissement (ex: 1d, 3h, 30m, 5s)')
        .setRequired(true))
    .addStringOption(option =>
      option
        .setName('raison')
        .setDescription('Raison du bannissement')
        .setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getMember('cible');
    const durationString = interaction.options.getString('duration');
    const durationMilliseconds = parseDuration(durationString); // Convertir la durée en millisecondes
    const formattedDuration = formatDuration(durationMilliseconds); // Formater la durée
    const reason = interaction.options.getString('raison') || 'Sans raison';
    const userMention = interaction.user.toString();

    try {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return await interaction.reply('Vous ne pouvez pas utiliser cette commande.');
      }

      await target.ban({ reason: reason });
      setTimeout(async () => {
        const unban = await interaction.guild.members.unban(target, 'Fin du bannissement temporaire.')
        if (unban) {
          interaction.followUp(`Fin du bannissement temporaire de ${target.user.username} !`)
        }
      }, durationMilliseconds);


      return await interaction.reply(`${userMention} a temporairement banni le membre ${target.user.username} pour une durée de ${formattedDuration} pour la raison suivante : ${reason}`);
    } catch (error) {
      console.error(error);
      return await interaction.reply("Une erreur s'est produite lors de l'exécution de la commande. Veuillez contacter mon créateur.");
    }
  }
};

// Fonction pour analyser la durée fait par l'utilisateur (ex: 1d, 3h, 30m) et la convertir en millisecondes
function parseDuration(durationString) {
  const durations = {
    's': 1000, // Seconde
    'm': 60000, // Minute
    'h': 3600000, // Heure
    'd': 86400000 // Jour
  };

  const regex = /(\d+)([smhd])/;
  const matches = durationString.match(regex);
  if (!matches) throw new Error('Format de durée invalide.');

  const [, amount, unit] = matches;
  return parseInt(amount) * durations[unit];
}

// Fonction pour formater la durée en une chaîne de caractères lisible
function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000) % 60;
  const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
  const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days) parts.push(`${days} jour${days > 1 ? 's' : ''}`);
  if (hours) parts.push(`${hours} heure${hours > 1 ? 's' : ''}`);
  if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (seconds) parts.push(`${seconds} seconde${seconds > 1 ? 's' : ''}`);

  return parts.join(', ');
}
