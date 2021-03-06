import { Command } from '@sapphire/framework';
import { CommandContext } from '../structures';
import type { Message } from 'discord.js';

export class PingCommand extends Command {
    public constructor(context: CommandContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'ping',
            aliases: ['pong'],
            description: 'ping pong',
        });
    }

    public async messageRun(message: Message) {
        const msg = await message.channel.send('Ping?');

        const content = `Pong from Typescript! Bot Latency ${Math.round(
            this.container.client.ws.ping
        )}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp}ms.`;

        return msg.edit(content);
    }
}
