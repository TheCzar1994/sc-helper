require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

if (!process.env.GUILD_IDS) {
  console.error("Missing GUILD_IDS environment variable in .env");
  process.exit(1);
}

const guildIds = process.env.GUILD_IDS.split(",").map((id) => id.trim());
console.log("Guild IDs:", guildIds);

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
      if (!guildId) {
        console.error("Encountered an empty guild ID, skipping.");
        continue;
      }

      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(
        `Successfully reloaded ${data.length} application (/) commands for guild ${guildId}.`
      );
    }

    console.log("All commands reloaded successfully for all specified guilds.");
  } catch (error) {
    console.error(error);
  }
})();
