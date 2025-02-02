// commands/find-motw.js
const { SlashCommandBuilder } = require("discord.js");
const guildSettings = require("../settings");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find-motw")
    .setDescription("Find valid Map of the Week suggestions."),
  async execute(interaction) {
    const guildId = interaction.guildId;

    if (!guildSettings[guildId]) {
      await interaction.reply({
        content: "Channels not set for this server. Use /set-channels first.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const { primary, secondary } = guildSettings[guildId];

    function extractMapKey(content) {
      const searchString = "https://beatsaver.com/maps/";
      const lowerContent = content.toLowerCase();
      const lowerSearchString = searchString.toLowerCase();
      if (lowerContent.includes(lowerSearchString)) {
        const index = lowerContent.indexOf(lowerSearchString);
        const after = content.substring(index + searchString.length);
        const match = after.match(/^([\w]+)/);
        if (match && match[1]) {
          return match[1];
        }
      }
      return null;
    }

    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    let primaryChannel, secondaryChannel;
    try {
      primaryChannel = await interaction.client.channels.fetch(primary);
      secondaryChannel = await interaction.client.channels.fetch(secondary);
    } catch (error) {
      console.error("Error fetching channels:", error);
      await interaction.editReply("Error fetching one or both channels.");
      return;
    }

    let primaryMessages, secondaryMessages;
    try {
      primaryMessages = await primaryChannel.messages.fetch({ limit: 100 });
      secondaryMessages = await secondaryChannel.messages.fetch({ limit: 100 });
    } catch (error) {
      console.error("Error fetching messages:", error);
      await interaction.editReply("Error fetching messages from channels.");
      return;
    }

    const secondaryMapKeys = new Set();
    for (const msg of secondaryMessages.values()) {
      const mapKey = extractMapKey(msg.content);
      if (mapKey) {
        secondaryMapKeys.add(mapKey);
      }
    }

    const validMaps = [];
    for (const msg of primaryMessages.values()) {
      const mapKey = extractMapKey(msg.content);
      if (mapKey) {
        if (secondaryMapKeys.has(mapKey)) {
          continue;
        }

        try {
          const response = await fetch(
            `https://beatsaver.com/api/maps/id/${mapKey}`
          );
          if (!response.ok) continue;
          const data = await response.json();
          if (!data.uploaded) continue;
          const uploadedDate = new Date(data.uploaded);
          const timeDiff = Date.now() - uploadedDate.getTime();

          if (timeDiff <= THIRTY_DAYS_MS) {
            validMaps.push({
              key: mapKey,
              mapName: data.name || "Unknown Name",
              uploaderName: data.uploader?.name || "Unknown Uploader",
              originalLink: `https://beatsaver.com/maps/${mapKey}`,
            });
          }
        } catch (error) {
          console.error(`Error processing map ${mapKey}:`, error);
        }
      }
    }

    if (validMaps.length === 0) {
      await interaction.editReply(
        "No valid maps found in the suggestions channel that haven't already won."
      );
    } else {
      let replyMessage = `Found **${
        validMaps.length
      }** valid Map of the Week suggestion${
        validMaps.length !== 1 ? "s" : ""
      } for Map of the Week:\n\n`;
      validMaps.forEach((map) => {
        replyMessage += `**Key:** ${map.key}\n`;
        replyMessage += `**Map Name & Uploader:** ${map.mapName} - ${map.uploaderName}\n`;
        replyMessage += `**Link:** <${map.originalLink}>\n\n`;
      });
      await interaction.editReply(replyMessage);
    }
  },
};
