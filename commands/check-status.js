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
        content:
          "Czar is messing with the settings again, please try again later! 🤖",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: "We all good, G! 🫡",
      ephemeral: true,
    });
  },
};
