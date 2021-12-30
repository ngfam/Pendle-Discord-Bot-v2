import { Args, Command } from '@sapphire/framework';
import { CommandContext } from '../structures';
import type { Guild, GuildMember, GuildMemberManager, Message, User } from 'discord.js';

export class MeetingCommand extends Command {
    public constructor(context: CommandContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'meeting',
            aliases: ['meeting'],
            description: 'See list of people not in the meeting',
        });
    }

    public async messageRun(message: Message, args: Args) {
        const guild = message.guild as Guild;
        const members = await (guild.members as GuildMemberManager).fetch();
        let ping = false;

        try {
            ping = (await args.pick('string')) === 'ping';
        } catch (e) {}

        let unjoinedMembers: string[] = [];

        for (let i = 0; i < members.size; ++i) {
            const member = members.at(i)!;
            if (member.voice.channelId != process.env.MEETING_ROOM) {
                unjoinedMembers.push(!ping ? member.user.username : member.user.toString());
            }
        }

        let content =
            unjoinedMembers.length === 0
                ? `Calmdown YK everyone is already in.\n`
                : `People who havent joined the meeting:\n`;
        content = content.concat(unjoinedMembers.join(', '));
        await message.channel.send(content);
    }
}
