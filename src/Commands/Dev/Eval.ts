import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('eval', {
    description: 'Evaluates JavaScript',
    category: 'dev',
    exp: 10,
    cooldown: 3,
    dm: true,
    usage: 'eval [JavaScript code]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, args: IArgs): Promise<void> => {
        const owner = ['923224875937', '919389379221']
        if (!owner.includes(M.sender.jid.split('@')[0])) return void M.reply('*Fuck you🤍✨ Only ᴹᴿ᭄ ᴋᴀᴋᴀsʜɪོ ×፝֟͜× and AliAryanTech Are ✅ Allowed to use this command You ❌ Dont Deserve This Bastard 😂*')
        let out: string
        try {
            const result = eval(args.context)
            out = JSON.stringify(result, null, '\t') || 'Evaluated JavaScript'
        } catch (error: any) {
            out = error.message
        }
        return void M.reply(out)
    }
}
