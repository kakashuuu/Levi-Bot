import { BaseCommand, Message, Command } from '../../Structures'

@Command('tech-news', {
    aliases: ['tn'],
    description: 'Get information about the current technology',
    category: 'utils',
    usage: 'tech-news',
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const { inshorts } = await this.client.utils.fetch<{ inshorts: String[] }>(
            'https://pvx-api-vercel.vercel.app/api/news'
        )
        let msg = '📺 *Tech News* 📺'
        for (let i = 0; i < inshorts.length; ++i) {
            msg += `\n\n*${1 + i}#*\n${inshorts[i]}`
        }
        return void M.reply(msg)
    }
}
