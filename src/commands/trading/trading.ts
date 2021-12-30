import { Args, Command } from '@sapphire/framework';
import { CommandContext, SubgraphQuery } from '../../structures';
import { Message, MessageEmbed } from 'discord.js';
import { subgraphs } from '../../graphql';
import { gql } from 'graphql-request';
import { consts, convertUnixToDate, getField, numberPrettify } from '../../helpers';
import QuickChart from 'quickchart-js';
import console from 'console';

export type TradingData = {
    dayStartUnix: number;
    dailyVolumeUSD: string;
};

export class TradingCommand extends Command {
    tradingQuery: SubgraphQuery;

    public constructor(context: CommandContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'trading',
            aliases: ['trading'],
            fullCategory: ['trading'],
            description: 'Get trading volume',
        });
        this.tradingQuery = new SubgraphQuery(gql`
            {
                pairDailyDatas(first: 1000, orderBy: dayStartUnix, orderDirection: desc) {
                    dayStartUnix
                    dailyVolumeUSD
                }
            }
        `);
    }

    public async messageRun(message: Message, args: Args) {
        const msg = await message.channel.send('Loading data...');
        let avaxData = await this.tradingQuery.query(subgraphs.avax.mainUrl, {});
        let etherData = await this.tradingQuery.query(subgraphs.ether.mainUrl, {});
        let BLOCK_SIZE = 1;
        try {
            BLOCK_SIZE = await args.pick('number');
        } catch (err) {}
        const msgContent = await decorateMessage(
            avaxData.pairDailyDatas,
            etherData.pairDailyDatas,
            BLOCK_SIZE
        );
        await msg.channel.send({ embeds: [msgContent] });
    }
}

async function decorateMessage(
    avax: TradingData[],
    ether: TradingData[],
    BLOCK_SIZE: number
): Promise<MessageEmbed> {
    let labels: string[] = [];
    let avaxTrading: number[] = [];
    let etherTrading: number[] = [];
    const NUM_BLOCK = 31; // yes, only 31 weeks
    const LATEST_DATE = Math.floor(Date.now() / 1000 / consts.ONE_DAY);

    let totalAvax: number = 0;
    let totalEther: number = 0;

    // Adding last 31 blocks to map
    for (let i = 0, currentDate = LATEST_DATE; i < NUM_BLOCK; ++i, currentDate -= BLOCK_SIZE) {
        const lastDate = convertUnixToDate(currentDate * consts.ONE_DAY);
        const firstDate = convertUnixToDate((currentDate - BLOCK_SIZE + 1) * consts.ONE_DAY);
        if (firstDate === lastDate) {
            labels.push(firstDate);
        } else {
            labels.push(firstDate.concat(' - ').concat(lastDate));
        }
        avaxTrading.push(0);
        etherTrading.push(0);
    }

    for (let i = 0; i < avax.length; ++i) {
        const data = avax[i];
        const date = Math.floor(data.dayStartUnix / consts.ONE_DAY);
        const id = Math.floor((LATEST_DATE - date) / BLOCK_SIZE);
        if (id < NUM_BLOCK) {
            avaxTrading[id] = avaxTrading[id] + parseFloat(data.dailyVolumeUSD);
        }
        totalAvax = totalAvax + parseFloat(data.dailyVolumeUSD);
    }

    for (let i = 0; i < ether.length; ++i) {
        const data = ether[i];
        const date = Math.floor(data.dayStartUnix / consts.ONE_DAY);
        const id = Math.floor((LATEST_DATE - date) / BLOCK_SIZE);
        if (id < NUM_BLOCK) {
            etherTrading[id] = etherTrading[id] + parseFloat(data.dailyVolumeUSD);
        }
        totalEther = totalEther + parseFloat(data.dailyVolumeUSD);
    }

    const chart = new QuickChart();
    chart.setConfig({
        type: 'line',
        data: {
            labels: labels.reverse(),
            datasets: [
                {
                    label: 'Avax',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgb(255, 99, 132)',
                    fill: false,
                    data: avaxTrading.reverse().map((value, index) => value / 1000),
                },
                {
                    label: 'Ethereum',
                    backgroundColor: 'rgba(132, 99, 255, 0.5)',
                    borderColor: 'rgb(132, 99, 255)',
                    fill: false,
                    data: etherTrading.reverse().map((value, index) => value / 1000),
                },
            ],
        },
        options: {
            plugins: {
                tickFormat: {
                    suffix: 'k',
                },
            },
            scales: {
                yAxes: [
                    {
                        display: true,
                        type: 'logarithmic',
                        ticks: {
                            min: 5,
                        },
                    },
                ],
            },
        },
    });
    let embed = new MessageEmbed().setTitle('Pendle Protocol trading analytics');
    embed.setImage(await chart.getShortUrl());

    labels.reverse();
    avaxTrading.reverse();
    etherTrading.reverse();

    let avgAvax =
        avaxTrading.reduce((prev, val) => prev + val) / Math.min(consts.DAY_PER_MONTH, avax.length);
    let avgEther =
        etherTrading.reduce((prev, val) => prev + val) /
        Math.min(consts.DAY_PER_MONTH, ether.length);

    labels = labels.slice(0, 7).reverse();

    embed.addFields([
        {
            name: 'Total trading',
            value: `Avax: $${numberPrettify(totalAvax)}\nEther: $${numberPrettify(totalEther)}`,
            inline: false,
        },
        getField(
            'Avax',
            avaxTrading
                .slice(0, 7)
                .reverse()
                .map((value, index) => `${labels[index]}: $${numberPrettify(value)}`),
            true
        ),
        getField(
            'Ether',
            etherTrading
                .slice(0, 7)
                .reverse()
                .map((value, index) => `${labels[index]}: $${numberPrettify(value)}`),
            true
        ),
    ]);

    if (BLOCK_SIZE == 1) {
        embed.addFields([
            getField(
                'Average last 30 days',
                [`Avax: $${numberPrettify(avgAvax)}`, `Ether: $${numberPrettify(avgEther)}`],
                true
            ),
        ]);
    }
    return embed;
}
