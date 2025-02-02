# SC Helper

This is a simple bot that is currently implemented to help SC's find eligible Map of the Week contenders.

It works by checking a primary channel's last 20 messages for BeatSaver links, taking note of the map keys. It then searches those keys through the BeatSaver API to figure out if the map is less than 30 days old, as required for eligible Map of the Weeks. If it's more than 30 days old it discards it. If it's less than 30 days, it takes note of the map key, the title, and the uploader.

It then checks the secondary channel's last 5 messages for prior winners and discards those.

Finally, it outputs the final listing of eligible Map of the Week contenders with the Key, the Map Name and Uploader, and a link to the map.

There are 3 commands currently:

1. `/find-motw` - This does exactly as stated above and outputs the message only to the user running the command
2. `/display-find-motw` - The same as above but it displays to everyone in the channel it was run
3. `/set-channels` - Determines the primary and secondary channels to search.

# Outside Use

You can fork the repository and use it for your own purposes if you want to. You will need to create your own `.env` file with configurations as appropriate.

### Example `.env` file:

For use with 1 server, you can use something like this:

```
TOKEN=YOUR_DISCORD_APP_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_DISCORD_GUILD_ID
```

This also has the capability to run in more than 1 server. In that case, you'd just change "GUILD_ID" to "GUILD_IDS". So it would be something like this:

```
TOKEN=YOUR_DISCORD_APP_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_IDS=YOUR_DISCORD_GUILD_ID
```

You will need to run the bot on your own server to maintain uptime. Something like AmazonAWS EC2 on Ubuntu works well.

# To Run:

To run this project, use `npm install` to install the dependencies.

Use `npm run deploy` to deploy slash commands.

Use `npm start` to start the bot.
