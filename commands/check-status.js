const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const guildSettings = require("../settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-status")
    .setDescription("Check status"),
  async execute(interaction) {
    const guildId = interaction.guildId;

    if (!guildSettings[guildId]) {
      await interaction.reply({
        content:
          "The server was recently reset or an update was made.\nPlease wait a couple minutes and try again.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({
      content: "We all good, G! 🫡",
      flags: MessageFlags.Ephemeral,
    });
  },
};
