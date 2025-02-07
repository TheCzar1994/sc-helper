const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("flip-coin")
    .setDescription("Flips a coin and returns heads or tails."),

  async execute(interaction) {
    const outcome = Math.random() < 0.5 ? "Heads" : "Tails";

    await interaction.reply(`The coin landed on **${outcome}**!`);
  },
};
