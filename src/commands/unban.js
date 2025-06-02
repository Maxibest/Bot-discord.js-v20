const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const Command = require(`../structures/Command`);
const { EmbedBuilder } = require("discord.js");

class UnbanCommand extends Command {
    constructor() {
        super({
            name: 'unban',
            description: 'Unban un membre',
            category: 'moderation',
            permissions: [PermissionFlagsBits.BanMembers],
            cooldown: 5000
        });

        this.data = new SlashCommandBuilder()
            .setName('unban')
            .setDescription('Unban un membre')
            .addUserOption(option => option
                .setName('target')
                .setDescription('Le membre à débannir')
                .setRequired(true))
            .addStringOption(option => option
                .setName('reason')
                .setDescription('La raison du unban')
                .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
            .setDMPermission(false);
    }

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'Sans raison';
        const userMention = interaction.member.toString();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({
                content: 'Tu ne peux pas unban ce membre',
                flags: 64
            });
        }

        try {
            const bans = await interaction.guild.bans.fetch();
            if (!bans.has(target.id)) {
                return interaction.reply({
                    content: 'Ce membre n\'est pas banni !',
                    flags: 64
                });
            }

            const embed = new EmbedBuilder()    
                .setColor('Green')
                .setDescription(`${userMention} a unban le membre ${target.username} pour la raison suivante : ${reason}`);
            await interaction.guild.members.unban(target, reason);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erreur lors du unban:', error);
            await interaction.reply({
                content: 'Une erreur est survenue lors du unban du membre.',
                flags: 64
            });
        }
    }
}

module.exports = new UnbanCommand(); 