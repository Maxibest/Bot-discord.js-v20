const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const Command = require(`../structures/Command`);

class KickCommand extends Command {
    constructor() {
        super({
            name: 'kick',
            description: 'Sélectionne un membre pour le kick',
            category: 'moderation',
            permissions: [PermissionFlagsBits.KickMembers],
            cooldown: 5000
        });

        this.data = new SlashCommandBuilder()
            .setName('kick')
            .setDescription('Sélectionne un membre pour le kick')
            .addUserOption(option => option
                .setName('target')
                .setDescription('Le membre à kick')
                .setRequired(true))
            .addStringOption(option => option
                .setName('reason')
                .setDescription('La raison du kick')
                .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
            .setDMPermission(false);
    }

    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'Sans raison';
        const userMention = interaction.member.toString();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return await interaction.reply({ 
                content: 'Tu ne peux pas kick ce membre',
                flags: 64
            });
        }

        try {
            await interaction.guild.members.kick(target, { reason: reason });
            await interaction.reply(`Le membre ${target.username} a été expulsé par ${userMention} pour la raison suivante : ${reason}`);
            console.log(`Le membre ${target.username} a été expulsé par ${userMention} pour la raison suivante : ${reason}`);
        } catch (error) {
            console.error(`Une erreur s'est produite lors de l'expulsion du membre : ${error}`);
            if (error.code === 50013) {
                await interaction.reply({
                    content: 'Je n\'ai pas la permission d\'expulser ce membre.',
                    flags: 64
                });
            } else {
                await interaction.reply({
                    content: `Impossible d'expulser le membre ${target.username}.`,
                    flags: 64
                });
            }
        }
    }
}

module.exports = new KickCommand(); 