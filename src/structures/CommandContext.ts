import { Args, Command, PieceContext } from '@sapphire/framework';
import { Message } from 'discord.js';

export interface CommandContext extends Command.Context, PieceContext {}
