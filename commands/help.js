const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Display a list of commands with descriptions."),
  async execute(interaction) {
    const commandList = `
**/bsr** - Retrieve map info from BeatSaver.
**/check-status** - Checks if the display-find-motw and find-motw commands are available.
**/display-find-motw** - Same as find-motw, but displays the results in chat for all to see.
**/find-motw** - Find valid Map of the Week suggestions.
**flip-coin** - Flips a coin with a 50/50 chance of heads or tails.
**help** - Display a list of commands with descriptions.
**set-channels** - Set the primary and secondary channels for the Map of the Week. This command is restricted to Admins only.
    `;

    await interaction.reply({
      content: commandList,
      flags: MessageFlags.Ephemeral,
    });
  },
};
