import { Args, Command } from '@sapphire/framework';
import { CommandContext } from '../structures';
import {
    Guild,
    GuildManager,
    GuildMember,
    GuildMemberManager,
    Message,
    TextChannel,
    User,
} from 'discord.js';

export class HpnyCommand extends Command {
    public constructor(context: CommandContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'hpny',
            aliases: ['hpny'],
            description: 'Wish every one a happy new year',
        });
    }

    public async messageRun(message: Message, args: Args) {
        const guild = (await message.client.guilds.fetch({
            guild: process.env.INTERNAL_SERVER as string,
        })) as Guild;
        const members = await (guild.members as GuildMemberManager).fetch();
        const channel: TextChannel = (await guild.channels.fetch(
            process.env.HPNY_CHANNEL as string
        )) as TextChannel;

        await channel.send('@everyone');
        for (let script of scripts_before) {
            await channel.sendTyping();
            await delay(5000);
            await channel.send(script);
        }

        for (let [_, member] of members) {
            if (member.user.bot) continue;
            let randomWish =
                member.user.toString() + '. ' + wishes[Math.floor(Math.random() * wishes.length)];
            await channel.sendTyping();
            await delay(5000);
            await channel.send(randomWish);
        }

        for (let script of scripts_after) {
            await channel.sendTyping();
            await delay(5000);
            await channel.send(script);
        }
        console.log(backslash);
    }
}

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const scripts_before = [
    "Oh hey Pendlees, if Anton is summoning me at this hour, I guess it's about the end of the year.",
    'This might sound a bit like TN, but it has been a Long year, but as we worked hard, we deserve to enjoy.',
    'I hope you all are having a great time around your family.',
    "Here's some random wishes I copied from the internet for you all.",
];

const wishes = [
    'Happy New Year! May the coming year be full of grand adventures and opportunities.',
    'Life is short - dream big and make the most of 2022!',
    'May the New Year bring you happiness, peace, and prosperity. Wishing you a joyous 2022!',
    "Happy New Year! Let's toast to yesterday's achievements and tomorrow's bright future.",
    'Wishing you health, wealth, and happiness in the New Year ahead.',
    'Happy New Year! Best wishes for peace and prosperity in 2022.',
    'Happy New Year! May the best day of your past be the worst day of your future.',
    'Happy New Year! Let’s see how many more ‘90s styles we’ll bring back from our old family albums!',
    'No matter where this year takes us, we’ll always feel at home when we’re with family.',
    'They say blood is thicker than water, but champagne’s stronger than both—let’s drink and celebrate the new year!',
    'There’s no group I’d rather “cheers” with while celebrating this new beginning. Happy New Year!',
    'Like your favorite accessory, I’ll be by your side wherever 2022 takes us.',
    'May every moment of this year would be unique, filled with pure pleasure and each day comes out like exactly what you want…Happy New Year.',
    'Enjoy this special time of year with those you love, and may the Lord bless you all with a happy and healthy New Year.',
    'Let’s see what kind of shenanigans we can get ourselves into in the next 12 months!',
    'All that glitters is gold, and this group sure is golden. Happy New Year!',
    "Wishing you a Happy New Year, bursting with fulfilling and exciting opportunities. And remember, if opportunity doesn't knock, build a door!",
    'Happy 2022! Please don’t make a resolution of quitting this year.',
    'Here’s to another year of asking if that meeting was actually necessary.',
    'Wishing you all a blissful new year. Hope that joy and success follow you in every sector of life.',
    'To a New Year full of new possibilities, even though I’m sure we’ll just do the same old stuff anyway.',
    'This new year message is packed full of virus-free hugs and kisses just for you! We hope you have a very happy new year and that we can see you again soon. Until then, cheers to you from afar for your good health and happiness!',
    'Happy new year, and congrats. You just won 10 $PENDLE from our big boi Anton LOLOLOLL.',
    'May a gift of 20 $PENDLE from Anton be with you this year.',
    'How do you like spending your great 2022 with 30 $PENDLE from Anton?'
];

const backslash = '\\';

const scripts_after = [
    '@everyone Thank you all for such a Pendle. I wish you all a Happy New Year.',
    `\`\`\`
         .* *.               \`o\`o\`               PENDLE 2022
         *. .*              o\`o\`o\`o      ^,^,^
           * ${backslash}               \`o\`o\`     ^,^,^,^,^
              ${backslash}     ***        |       ^,^,^,^,^
               ${backslash}   *****       |        /^,^,^
                ${backslash}   ***        |       /
    ~@~*~@~      ${backslash}   ${backslash}         |      /
  ~*~@~*~@~*~     ${backslash}   ${backslash}        |     /
  ~*~@smd@~*~      ${backslash}   ${backslash}       |    /     #$#$#        .\`'.;.
  ~*~@~*~@~*~       ${backslash}   ${backslash}      |   /     #$#$#$#   00  .\`,.',
    ~@~*~@~ ${backslash}        ${backslash}   ${backslash}     |  /      /#$#$#   /|||  \`.,'
_____________\\________\\___\\____|_/______/_________|\\/\\___||______
\`\`\``,
];
