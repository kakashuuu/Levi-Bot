import { Command, BaseCommand, Message } from '../../Structures'

@Command('end-auction', {
    description: 'Forfeits the ongoing auction',
    category: 'cards',
    aliases: ['endauc'],
    usage: 'endauc',
    exp: 20,
    cooldown: 5
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!this.handler.auction.has(M.from)) return void M.reply('No auction are going on right now, Baka!')
        this.handler.auction.delete(M.from)
        this.handler.highestBit.delete(M.from)
        return void M.reply('You have forfeited the auction')
    }
}
