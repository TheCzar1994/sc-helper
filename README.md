# SC Helper

This is a simple bot that is currently implemented to help SC's find eligible Map of the Week contenders.

It works by checking a primary channel's last 20 messages for BeatSaver links, taking note of the map keys. It then searches those keys through the BeatSaver API to figure out if the map in each message is less than 30 days old (as required for eligible Map of the Weeks). If it's more than 30 days old it discards it. If it's less than 30 days old, it takes note of the map key, title, the uploader, any collaborators, and the full link to the map.

It then checks the secondary channel's last 5 messages for prior winners by searching for the map keys noted previously and then discards those.

Finally, it outputs the final listing of eligible Map of the Week contenders in order of oldest to newest with the the Map Name and Uploader, collaborators if there are any, a link to the map, and the age of the map in days; with a total count at the top.

There are currently 4 commands:

1. `/find-motw` - This does exactly as stated above and outputs the message only to the user running the command.
2. `/display-find-motw` - The same as above but it displays to everyone in the channel it was run.
3. `/set-channels` - Sets the primary and secondary channels to search when using Command 1 or 2. I would recommend restricting the use of this command within Discord to prevent accidental changes.
4. `/check-status` - Simple command that basically tells you if the channels are set without hitting the BeatSaver API.

## Outside Use

Not really sure what your outside use would be but you can fork the repository and use it for your own purposes if you want to. You will need to create your own `.env` file with configurations as appropriate. You'll also need to obtain your own Discord App Token, Client ID, and specify your Guild ID(s).

### Example `.env` file:

The default code has the ability to run the bot in more than 1 server. This would be your default `.env` file:

```
TOKEN=YOUR_DISCORD_APP_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_IDS=YOUR_DISCORD_GUILD_ID,ANOTHER_DISCORD_GUILD_ID_IF_NEEDED
```

For use with 1 server, you can use something like this but you'll need to do some minor code modifications:

```
TOKEN=YOUR_DISCORD_APP_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_DISCORD_GUILD_ID
```

The first example _should_ work even with just one guild ID, but I haven't tested that so 🤷‍♂️

You will need to run the bot on your own server to maintain uptime - something like Amazon AWS EC2 on Ubuntu works well. Would also recommend installing pm2 and using that.

## To Run:

To run this project locally, use `npm install` to install the dependencies.

Use `npm run deploy` to deploy slash commands.

Use `npm start` to start the bot.
