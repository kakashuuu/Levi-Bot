import { BaseCommand, Message, Command } from '../../Structures'
import { IArgs } from '../../Types'
import { summary } from 'wikipedia'

@Command('wikipedia', {
    aliases: ['wiki'],
    description: 'Will fetch the result of the given query from wikipedia',
    category: 'utils',
    usage: 'wiki [query]',
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a search term')
        const term = context.trim()
        const wiki = await summary(term)
        if (!wiki.description) return void M.reply('Could not find')
        let text = ''
        text += `*🎀 Title: ${wiki.title}*\n\n`
        text += `*📜 Description: ${wiki.description}*\n\n`
        text += `*🌐 URL: ${wiki.content_urls.desktop.page}*\n\n`
        text += `*❄ Summary:* ${wiki.extract}`
        M.reply(text)
    }
}
