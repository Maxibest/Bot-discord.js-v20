const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Je snipe les membres tel l\'élite'),

  async execute(interaction) {
    const snipes = await db.get(`snipes_${interaction.channel.id}`) || [];
    const snipedMsg = snipes[0];

    console.log("Snipes:", snipes);
    console.log(snipedMsg);

    if (!snipedMsg) {
      return interaction.reply("Snipe est non valide");
    } else {
      const embed = new EmbedBuilder()
        .setAuthor({ name: snipedMsg.author, iconURL: snipedMsg.avatarURL })
        .setDescription(snipedMsg.content)
        .setColor("00FFFF")
        .setTimestamp(snipedMsg.timestamp);

      if (snipedMsg.image) {
        embed.setImage(snipedMsg.image);
      }
      await interaction.reply({ embeds: [embed] });
    }
  },

  async saveDeletedMessage(message) {
    const snipes = await db.get(`snipes_${message.channel.id}`) || [];
    snipes.unshift({
      content: message.content,
      author: message.author.tag,
      avatarURL: message.author.displayAvatarURL(),
      timestamp: message.createdTimestamp,
      image: message.attachments.first() ? message.attachments.first().proxyURL : null
    });
    await db.set(`snipes_${message.channel.id}`, snipes.slice(0, 10));
  }
};
