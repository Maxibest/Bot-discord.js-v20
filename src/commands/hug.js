const { SlashCommandBuilder } = require('@discordjs/builders');
const Command = require(`../structures/Command`);
const { EmbedBuilder } = require("discord.js");

class HugCommand extends Command {
    constructor() {
        super({
            name: 'hug',
            description: 'Hug une personne',
            category: 'divertissement',
            cooldown: 5000
        });
        
        this.data = new SlashCommandBuilder()
            .setName('hug')
            .setDescription('Hug une personne')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('The user you want to hug')
                    .setRequired(true)
            );
    }
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        const fetch = (await import('node-fetch')).default;

        const apiKey = process.env.API_KEY_HUGS; // KEY API(tenor.com)
        const searchTerm = 'anime hug';
        const limit = 400;
        const url = `https://g.tenor.com/v2/search?q=${searchTerm}&key=${apiKey}&limit=${limit}`;

        const response = await fetch(url);
        const result = await response.json();

        const randomIndex = Math.floor(Math.random() * result.results.length);
        const gifUrl = result.results[randomIndex].media_formats.gif.url;

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`${interaction.user} hugs ${user}`)
            .setImage(gifUrl)
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    }
};

module.exports = new HugCommand();