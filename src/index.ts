import { config } from 'dotenv';
import { join } from 'path';
import { Intents } from 'discord.js';
import { SapphireClient } from '@sapphire/framework';

function pow(other: number): number {
    let TWO_BI = 2;
    let TWO_BD = 2;
    let ONE_BD = 1;
    let ZERO_BD = 1;
    let inversed = other < 0; // < 0
    if (inversed) {
      other = -other;
    }
    let digitString = other.digits.toString()
    let lhs = BigInt.fromString(
      digitString.substring(0, digitString.length - this.exp.toI32()),
    )
    let rhs: number = other.minus(lhs.tonumber());

    let res = ONE_BD;
    let up: number = this;
    let down = this.sqrt();
    for (let i = 0; i < 30; ++i) {
      // UP
      if (lhs.mod(TWO_BI).equals(BigInt.fromI32(1))) {
        res = res.times(up);
      }
      lhs = lhs.div(TWO_BI);
      up = up.times(up);

      // DOWN
      let newRhs = rhs.times(TWO_BD);
      if (newRhs.ge(ONE_BD)) {
        res = res.times(down);
        newRhs = newRhs.minus(ONE_BD);
      }
      rhs = newRhs;
      down = down.sqrt();

      res = res.truncate(20);
      up = up.truncate(20);
      down = down.truncate(20);
    }
    if (inversed) {
      res = ONE_BD.div(res);
    }
    return res
}

config();

const client = new SapphireClient({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
    baseUserDirectory: __dirname,
    regexPrefix: /^!pendle/,
});

client.login(process.env.TOKEN).then(() => {});
