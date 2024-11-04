import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('tictactoe', {
    description: 'Play Tic-Tac-Toe on WhatsApp',
    aliases: ['ttt'],
    category: 'games',
    cooldown: 10,
    usage: 'tictactoe [option]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context)
            return void M.reply(
                `❌ *Tic-Tac-Toe* ⭕ Commands\n\n🎗️ *${this.client.config.prefix}tictactoe challenge [tag/quote]* - Challenges the tagged or quoted person for a match\n\n🎀 *${this.client.config.prefix}tictactoe accept* - Accepts the challenge if anyone challenged you for a match\n\n🔰 *${this.client.config.prefix}tictactoe reject* - Rejects the incoming challenge\n\n💠 *${this.client.config.prefix}tictactoe mark* - Marks your place in the board of the game\n\n♻ *${this.client.config.prefix}tictactoe forfeit* - Forfeits the ongoing game`
            )
        let board = ['', '', '', '', '', '', '', '', '']
        const options = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
        let taken: string[] = []
        const term = context.toLowerCase().trim().split(' ')
        switch (term[0]) {
            default:
                return void M.reply(`Invalid Usage Format. Use *${this.client.config.prefix}tictactoe* for more info.`)

            case 'c':
            case 'challenge':
                if (this.ongoing.has(M.from) || this.challenges.has(M.from))
                    return void M.reply(`A game session is already going on`)
                if (M.quoted && !M.mentioned.includes(M.quoted.sender.jid)) M.mentioned.push(M.quoted.sender.jid)
                if (!M.mentioned.length || M.mentioned['length'] < 1)
                    return void M.reply('Tag or quote a user to challenge')
                const user = M.mentioned[0]
                if (user === M.sender.jid) return void M.reply("You can't challenge yourself, Baka!")
                this.challenges.set(M.from, {
                    challenger: M.sender.jid,
                    challengee: user
                })
                return void M.reply(
                    `*@${M.sender.jid.split('@')[0]}* has challenged *@${
                        user.split('@')[0]
                    }* for a Tic-Tac-Toe match. Use *${this.client.config.prefix}tictactoe accept* to start the game`,
                    'text',
                    undefined,
                    undefined,
                    undefined,
                    [M.sender.jid, user]
                )

            case 'a':
            case 'accept':
                const challenge = this.challenges.get(M.from)
                if (challenge?.challengee !== M.sender.jid) return void M.reply('No one challenged you to a match')
                this.ongoing.set(M.from, {
                    players: [challenge?.challengee as string, challenge?.challenger as string]
                })
                this.game.set(M.from, {
                    lastMarked: challenge?.challengee as string,
                    board,
                    taken
                })
                return void (await M.reply(
                    this.client.assets.get('tic-tac-toe') as Buffer,
                    'image',
                    undefined,
                    undefined,
                    `Game Started!\n❌ - *@${challenge.challenger.split('@')[0]}*\n⭕ - *@${
                        challenge.challengee.split('@')[0]
                    }*`,
                    [challenge.challengee, challenge.challenger]
                ))

            case 'reject':
            case 'r':
                const ch = this.challenges.get(M.from)
                if (ch?.challengee !== M.sender.jid && ch?.challenger !== M.sender.jid)
                    return void M.reply('No one challenged you to a match nor you challenged someone for a game')
                this.challenges.delete(M.from)
                return void M.reply(
                    ch.challenger === M.sender.jid
                        ? `You rejected your challenge`
                        : `You Rejected *@${ch.challenger.split('@')[0]}*'s Challenge`,
                    'text',
                    undefined,
                    undefined,
                    undefined,
                    ch.challenger === M.sender.jid ? undefined : [ch.challenger]
                )

            case 'mark':
                if (!this.ongoing.has(M.from)) return void M.reply('No matches are ongoing at the moment')
                let ttt = this.game.get(M.from)
                const Ttt = this.ongoing.get(M.from)
                if (!Ttt?.players.includes(M.sender.jid)) return void M.reply("You aren't even in the game, Baka!")
                if (ttt?.lastMarked === M.sender.jid) return void M.reply('Not your turn')
                if (!term[1] || term[1] === undefined || term[1] === '') return void M.reply('Provide the mark, Baka!')
                if (!options.includes(term[1]))
                    return void M.reply(
                        `Invalid option for marking. Available options for marking - *${options.join(', ')}*`
                    )
                if (ttt?.taken.includes(term[1])) return void M.reply('This place has already been marked, Baka!')
                const modified = parseInt(
                    term[1]
                        .replace('a1', '0')
                        .replace('a2', '1')
                        .replace('a3', '2')
                        .replace('b1', '3')
                        .replace('b2', '4')
                        .replace('b3', '5')
                        .replace('c1', '6')
                        .replace('c2', '7')
                        .replace('c3', '8')
                )
                let mark: 'X' | 'O' = 'X'
                if (Ttt.players[1] !== M.sender.jid) mark = 'O'
                board = ttt?.board as string[]
                board[modified] = mark
                taken = ttt?.taken as string[]
                taken.push(term[1])
                this.game.set(M.from, { lastMarked: M.sender.jid, board, taken })
                ttt = this.game.get(M.from)
                const verify = this.client.utils.verifyWin(ttt?.board as string[], Ttt.players[1], Ttt.players[0])
                const image = await this.client.utils.displayBoard(ttt?.board as string[])
                if (verify !== 'draw' && taken.length <= 9) {
                    const text = `*@${verify.split('@')[0]}* has won the match`
                    this.ongoing.delete(M.from)
                    this.challenges.delete(M.from)
                    this.game.delete(M.from)
                    await this.client.DB.setExp(verify, 150)
                    return void (await M.reply(image, 'image', undefined, undefined, text, [verify]))
                } else if (taken.length === 9) {
                    const text = `The match has been drawn`
                    await this.client.DB.setExp(Ttt.players[0], 75)
                    await this.client.DB.setExp(Ttt.players[1], 75)
                    this.ongoing.delete(M.from)
                    this.challenges.delete(M.from)
                    this.game.delete(M.from)
                    return void (await M.reply(image, 'image', undefined, undefined, text))
                } else {
                    return void (await M.reply(image, 'image'))
                }

            case 'ff':
            case 'forfeit':
                if (!this.ongoing.has(M.from)) return void M.reply('No games are going on at the moment')
                const TTt = this.ongoing.get(M.from)
                if (!TTt?.players.includes(M.sender.jid)) return void M.reply("You aren't even in the game, Baka!")
                const index = TTt.players.findIndex((x) => x === M.sender.jid) === 0 ? 1 : 0
                await this.client.DB.setExp(TTt.players[index], 50)
                this.game.delete(M.from)
                this.challenges.delete(M.from)
                this.ongoing.delete(M.from)
                M.reply('You forfeited')
                return void M.reply(
                    `*@${Ttt?.players[index].split('@')[0]}* has won the match`,
                    'text',
                    undefined,
                    undefined,
                    undefined,
                    [TTt.players[index]]
                )
        }
    }

    private game = new Map<string, { lastMarked: string; board: string[]; taken: string[] }>()

    private challenges = new Map<string, { challenger: string; challengee: string }>()

    private ongoing = new Map<string, { players: string[] }>()
}
