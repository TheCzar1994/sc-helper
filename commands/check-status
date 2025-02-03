const { SlashCommandBuilder } = require("discord.js");
const guildSettings = require("../settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check-status")
    .setDescription("Check status"),
  async execute(interaction) {
    const guildId = interaction.guildId;

    if (!guildSettings[guildId]) {
      await interaction.reply({
        content: "Channels not set for this server. Use /set-channels first.",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: "All good G! 🫡",
      ephemeral: true,
    });
  },
};
