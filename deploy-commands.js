require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildIds = process.env.GUILD_IDS.split(",");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(
      `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
    );
  }
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands for multiple guilds.`
    );

    for (const guildId of guildIds) {
      const trimmedGuildId = guildId.trim();
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, trimmedGuildId),
        { body: commands }
      );
      console.log(
        `Successfully reloaded ${data.length} application (/) commands for guild ${trimmedGuildId}.`
      );
    }

    console.log("All commands reloaded successfully for all specified guilds.");
  } catch (error) {
    console.error(error);
  }
})();
