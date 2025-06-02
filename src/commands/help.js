const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, PermissionFlagsBits } = require("discord.js");
const Command = require(`../structures/Command`);
const { EmbedBuilder } = require("discord.js");


class helpCommand extends Command {
    constructor() {
        super({
            name: "help",
            description: "Affiche les commandes",
            cooldown: 5000,
        });

        this.data = new SlashCommandBuilder()
            .setName("help")
            .setDescription("Affiche les commandes")
            .setDMPermission(false);
    }
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("Help")
            .setDescription({content: `**📜 Commandes disponibles :**\n\n" +
                "🔹 `/avatar` — Affiche l'avatar d'un utilisateur\n" +
                "🔹 `/banner` — Affiche la bannière d'un utilisateur\n" +
                "🔹 `/purge` — Supprime un certain nombre de messages\n" +
                "🔹 `/snipe` — Récupère le dernier message supprimé\n" +
                "🔹 `/joke` — Blague au hasard\n" +
                "🔹 `/quiz` — Bientôt disponible\n`,
            flags: 64 })
            .setTimestamp();

            interaction.reply({ embeds: [embed] });
    }
}

module.exports = new helpCommand();