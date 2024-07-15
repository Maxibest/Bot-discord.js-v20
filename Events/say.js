const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Choisis ton message')
    .addUserOption(option => option
      .setName('user')
      .setDescription('Si vous souhaitez que je parle à votre place !')
      .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const content = interaction.content || '';
    const sayMess = content.split(' ').slice(1).join(' ');

    if (sayMess) {
      await interaction.reply(sayMess);
    } else {
      await interaction.reply('Fournir ton message.');
    }
  }
}