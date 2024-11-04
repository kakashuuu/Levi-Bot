import { BaseCommand, Message, Command } from '../../Structures'
import { IArgs } from '../../Types'
import translate from 'translate-google'

@Command('translate', {
    aliases: ['tr'],
    description: 'Will translate the given word to your selected language.',
    category: 'utils',
    usage: 'tr <word>|<language_code>\n\nExample: ${client.config.prefix}tr zh-cn|Hello',
    exp: 40
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const texts = context.trim().split('|')
        if (texts[0] === '')
            return void M.reply(`Use ${this.client.config.prefix}tr (word_that_you_wanna_translate|language_code)`)
        const word = texts[0]
        const code = texts[1]
        if (!code) return void M.reply('Give me the language code, Baka!')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await translate(word, { to: code }).catch((err: any) => {
            return void M.reply(`Invalid language code, Baka!`)
        })
        const text = `*🚥Result:*\n\n*Translation:* ${response}`
        M.reply(text)
    }
}
