import { BaseCommand, Command, Message } from '../../Structures'

@Command('rules', {
    description: 'shows the co-mods of the bot',
    usage: 'rules',
    category: 'core',
    exp: 10,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, message }: Message): Promise<void> => {
        const image = await this.client.utils.getBuffer('https://i.ibb.co/2MZKDGp/photo-2023-04-25-17-10-32.jpg')
        const MessageX = {
            image,
            caption: `┌ 「 Rules 」
│ 🛂 Supervision by the owner
│ ✅ Please comply
│ 
│ Regulations can be at any time
│changed for convenience
└────
1. Please don't spam bot commands
2. Don't send virtex, bug, trojan, etc to bot number
3. Insulting the owner will be picked up directly at their respective homes
4. The bot/owner is not responsible for what the user does to the command bot
5. Don't call / vc to bot numbers
6. EXP/Limit/Level cheats are prohibited
7. If the bot doesn't respond, it means it's off/fixed a bug
8. Please report any bugs via *!report*


 「 Consequences 」
1. If you violate rule number 5 (calling / vc) you will be blocked
2. If you violate the rules number 1, 2, 3 then you can get banned from bots
4. If you violate rule number 3 (insulting) then you will be picked up at your respective homes`
        }
        return void (await this.client.sendMessage(from, MessageX, {
            quoted: message
        }))
    }
}
