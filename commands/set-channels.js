// commands/set-channels.js
const { SlashCommandBuilder } = require("discord.js");
const guildSettings = require("../settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-channels")
    .setDescription("Set the primary and secondary channel IDs.")
    .addStringOption((option) =>
      option
        .setName("primary")
        .setDescription("Primary channel ID (where maps are suggested)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("secondary")
        .setDescription("Secondary channel ID (where the winners are listed)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const primary = interaction.options.getString("primary");
    const secondary = interaction.options.getString("secondary");
    const guildId = interaction.guildId;

    guildSettings[guildId] = { primary, secondary };

    await interaction.reply({
      content: `Channels set:\nPrimary: ${primary}\nSecondary: ${secondary}`,
      ephemeral: true,
    });
  },
};
