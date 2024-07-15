const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug une personne')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to hug')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        const fetch = (await import('node-fetch')).default;

        const apiKey = process.env.API_KEY_HUGS;
        const searchTerm = 'anime hug';
        const limit = 400;
        const url = `https://g.tenor.com/v1/search?q=${searchTerm}&key=${apiKey}&limit=${limit}`;

        const response = await fetch(url);
        const result = await response.json();

        const randomIndex = Math.floor(Math.random() * result.results.length);
        const gifUrl = result.results[randomIndex].media[0].gif.url;

        return interaction.reply(`\t${interaction.user} hugs ${user}\n${gifUrl}`);
    },
};
