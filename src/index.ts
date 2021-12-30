import { config } from 'dotenv';
import { join } from 'path';
import { Intents } from 'discord.js';
import { SapphireClient } from '@sapphire/framework';

config();

const client = new SapphireClient({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
    baseUserDirectory: __dirname,
    regexPrefix: /^!pendle/,
});

client.login(process.env.TOKEN).then(() => {});
