const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bsr")
    .setDescription("Retrieve map info from BeatSaver.")
    .addStringOption((option) =>
      option
        .setName("key")
        .setDescription("The map key to search for (e.g., ff9)")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const mapKey = interaction.options.getString("key");
    const url = `https://beatsaver.com/api/maps/id/${mapKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        return interaction.editReply({
          content: `Could not find a map with key \`${mapKey}\`.`,
        });
      }
      const data = await response.json();
      const mapId = data.id;
      const mapName = data.name;
      const description = data.description;
      const uploaderName = data.uploader?.name || "Unknown";
      const uploadedDate = new Date(data.uploaded);
      const month = uploadedDate.getMonth() + 1;
      const day =
        uploadedDate.getDate() < 10
          ? `0${uploadedDate.getDate()}`
          : uploadedDate.getDate();
      const year = uploadedDate.getFullYear();
      const formattedDate = `${month}-${day}-${year}`;

      let coverURL = null;
      if (Array.isArray(data.versions) && data.versions.length > 0) {
        coverURL = data.versions[data.versions.length - 1].coverURL;
      }

      let downloadURL = null;
      if (Array.isArray(data.versions) && data.versions.length > 0) {
        downloadURL = data.versions[data.versions.length - 1].downloadURL;
      }
      const arcViewerURL = `https://allpoland.github.io/ArcViewer/?id=${mapKey}`;
      const beatsaverURL = `https://beatsaver.com/maps/${mapKey}`;

      const fields = [
        { name: "ID", value: mapId, inline: true },
        { name: "Uploader", value: uploaderName, inline: true },
      ];

      if (data.collaborators && data.collaborators.length > 0) {
        const collaboratorsList = data.collaborators
          .map((collab) => collab.name)
          .join(", ");
        fields.push({
          name: "Collaborators",
          value: collaboratorsList,
          inline: true,
        });
      }

      fields.push(
        { name: "Uploaded", value: formattedDate, inline: true },
        { name: "Description", value: description, inline: false }
      );

      const embed = new EmbedBuilder()
        .setTitle(`${mapName}`)
        .setColor(0x0099ff)
        .addFields(...fields)
        .setThumbnail(coverURL);

      embed.setDescription(
        `[**BeatSaver**](${beatsaverURL}) | [**Download**](${downloadURL})\n` +
          `[**Preview in ArcViewer**](${arcViewerURL})`
      );

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching map data:", error);
      return interaction.editReply({
        content: "There was an error fetching the map data.",
      });
    }
  },
};
