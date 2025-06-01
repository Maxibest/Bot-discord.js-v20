const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, PermissionFlagsBits } = require("discord.js");
const Command = require(`../structures/Command`);

class BanCommand extends Command {
  constructor() {
    super({
      name: "ban",
      description: "Bannir un membre",
      category: "moderation",
      permissions: [PermissionFlagsBits.BanMembers],
      cooldown: 5000,
    });

    this.data = new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Bannir un membre")
      .setDMPermission(false)
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("Le membre à ban")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("La raison du ban")
          .setRequired(false)
      );
  }

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") ?? "Sans raison";
    const userMention = interaction.member.toString();

    if (
      interaction.member &&
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return await interaction.reply({
        content: "Vous ne pouvez pas ban ce membre",
        flags: 64,
      });
    } else {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Membre banni")
        .setDescription(
          `Le membre ${target.username} a été banni par ${userMention} pour la raison suivante : ${reason}`
        )
        .setTimestamp()
        .setFooter({ text: "Membre banni" });
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      await interaction.guild.members.ban(target, { reason: reason });
      console.log(
        `Le membre ${target.username} a été banni par ${userMention} pour la raison suivante : ${reason}`
      );
    } catch (error) {
      console.error(
        `Une erreur s'est produite lors du ban du membre : ${error}`
      );
      await interaction.reply({
        content: `Impossible de ban le membre ${target.username}.`,
        flags: 64,
      });
    }
  }
}

module.exports = new BanCommand();
