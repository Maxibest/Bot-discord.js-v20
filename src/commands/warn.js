const { SlashCommandBuilder } = require("discord.js");
const {
  PermissionFlagsBits,
  PermissionsBitField,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const Command = require(`../structures/Command`);


// Stocke le fichier d'avertissement
const warnsFilePath = path.join(__dirname, "warns.json");

// function pour charger les avertissements depuis le fichier
function loadWarns() {
  if (!fs.existsSync(warnsFilePath)) {
    fs.writeFileSync(warnsFilePath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(warnsFilePath, "utf8"));
}

// Sauvegarder les avertissements dans le fichier
function saveWarns(warns) {
  fs.writeFileSync(warnsFilePath, JSON.stringify(warns, null, 2));
}

class WarnCommand extends Command {
  constructor() {
    super({
      name: "warn",
      description: "Choisis le membre que veux warn",
    });
  
    this.data = new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Choisis le membre que veux warn")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Le membre à warn")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("La raison du warn")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
  }
  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") ?? "Sans raison";

    if (!target) {
      return await interaction.reply({
        content: "Le membre spécifié est introuvable.",
        flags: 64,
      });
    }

    const members = await interaction.guild.members
      .fetch(target.id)
      .catch(() => null);
    if (!members) {
      return await interaction.reply({
        content: "Le membre est introuvable",
        flags: 64,
      });
    }

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return await interaction.reply({
        content: "Tu n'as pas la permission d'utiliser cette commande !",
        flags: 64,
      });
    }

    //Vérifie s'il n'est pas attribué à un bot
    if (members.user.bot) {
      return interaction.reply({
        content: "Je ne peux pas warn un bot",
        flags: 64,
      });
    }

    //Vérification du rôle
    if (
      members.roles.highest.position >=
      interaction.member.roles.highest.position
    ) {
      return await interaction.reply({
        content: "Je ne peux pas warn ce membre",
        flags: 64,
      });
    }

    // Vérification des permissions de l'utilisateur
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return await interaction.reply({
        content: "Tu n'as pas la permission d'utiliser cette commande !",
        flags: 64,
      });
    }

    // Vérification des permissions du bot
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    ) {
      return await interaction.reply({
        content: "Je n'ai pas la permission de bannir des membres !",
        flags: 64,
      });
    }

    const member = await interaction.guild.members
      .fetch(target.id)
      .catch(() => null);
    if (!member) {
      return await interaction.reply({
        content: "Le membre spécifié est introuvable dans ce serveur.",
        flags: 64,
      });
    }

    // Charger les avertissements
    const warns = loadWarns();

    // Vérifier si l'utilisateur a déjà des avertissements
    if (!warns[target.id]) {
      warns[target.id] = 0; // Initialiser l'utilisateur avec 0 avertissements
    }

    // Incrémenter le nombre d'avertissements
    warns[target.id]++;
    saveWarns(warns);

    // Si l'utilisateur a atteint 5 avertissements > le bannir
    if (warns[target.id] >= 5) {
      try {
        await member.ban({
          reason: `Avertissement excessif - ${warns[target.id]} warns`,
        });

        const embed = new EmbedBuilder()
          .setTitle("Membre Banni")
          .setDescription(
            `${target.username} a été banni après avoir reçu 5 avertissements.`
          )
          .setColor(0xff0000)
          .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        console.log(`${target.username} a été banni après 5 avertissements.`);
      } catch (error) {
        console.error("Erreur lors du bannissement :", error);
        if (error.code === 50013) {
          await interaction.reply(
            "Je n'ai pas la permission de bannir ce membre."
          );
        } else {
          await interaction.reply(
            `Impossible de bannir le membre ${target.username}.`
          );
        }
      }
    } else {
      // Informer le membre du nombre d'avertissements
      const embed = new EmbedBuilder()
        .setTitle("Avertissement")
        .setDescription(`${target.username} a été averti.`)
        .addFields({ name: "Raison", value: reason })
        .addFields({
          name: "Nombre d'avertissements",
          value: warns[target.id].toString(),
        })
        .setColor(0xff0000)
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });

      console.log(
        `${
          target.username
        } a été averti pour la raison suivante : ${reason}. Avertissement n°${
          warns[target.id]
        }`
      );
    }
  }
};

module.exports = new WarnCommand();
