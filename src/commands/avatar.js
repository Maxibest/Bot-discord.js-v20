const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Command = require(`../structures/Command`);

class AvatarCommand extends Command {
  constructor() {
    super({
      name: "avatar",
      description: "Je te passe l'image de qui?",
    });
  
    this.data = new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Je te passe l'image de qui?")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to get the avatar of")
        .setRequired(true)
    );
  }
  async execute(interaction) {
    try {
      const user = interaction.options.getUser("user");
      const avatar = user.displayAvatarURL({ size: 1024, dynamic: true });

      const embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatar)
        .setColor("#0C0202");

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Impossible de montrer son avatar",
        ephemeral: true,
      });
    }
  }
};

module.exports = new AvatarCommand();
