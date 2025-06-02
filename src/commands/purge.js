const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Command = require(`../structures/Command`);

class PurgeCommand extends Command {
  constructor() {
    super({
      name: 'purge',
      description: 'Supprime un nombre spécifié de messages',
      usage: 'purge <nombre>',
      category: 'moderation',
      aliases: ['clear'],
      cooldown: 5000,
      permissions: [PermissionsBitField.Flags.ManageMessages],
      botPermissions: [PermissionsBitField.Flags.ManageMessages],
      userPermissions: [PermissionsBitField.Flags.ManageMessages],
    });

    this.data = new SlashCommandBuilder()
      .setName('purge')
      .setDescription('Supprime un nombre spécifié de messages')
      .addNumberOption(option =>
        option.setName('nummessages')
          .setDescription('Nombre de messages à supprimer')
          .setRequired(true)
        );
    }

  async execute(interaction) {
    const numMessages = interaction.options.getNumber('nummessages');

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return await interaction.reply({
        content: 'Tu ne peux pas utiliser cette commande bahahah rip 😘 !',
        flags: 64,
      });
    }
    try {
      if (numMessages > 100) {
        await interaction.reply({
          content: "La limite de suppression des messages Discord est de 100 messages !",
          flags: 64,
        });
      } else {
        await interaction.channel.bulkDelete(numMessages);
        await interaction.reply({
          content: "Les messages ont été supprimés avec succès.",
          flags: 64,
        });
      }
    } catch (error) {
      console.error(error)
      interaction.reply(`Ah désolé, j\'ai rencontré une erreur qui doit être corrigée. Kaïto, aide-moi 🤖 `);
    }
  }
};

module.exports = new PurgeCommand();