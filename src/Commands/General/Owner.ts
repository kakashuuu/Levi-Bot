import { BaseCommand, Message, Command } from '../../Structures'

@Command('owner', {
    description: 'sends bot owner number',
    category: 'core',
    aliases: ['creator'],
    usage: 'owner',
    dm: true,
    cooldown: 5,
    exp: 50
})
export default class extends BaseCommand {
    public override execute = async ({ from, sender, message }: Message): Promise<void> => {
        const vcard =
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'FN: ❤Master Kakashi ❤\n' +
            'ORG: Kakashi Botz. Inc.;\n' +
            'TEL;type=CELL;type=VOICE;waid=919389379221:+91 9389 3792 21\n' +
            'END:VCARD'
        return void (await this.client.sendMessage(
            from,
            {
                contacts: {
                    displayName: '❤✨ ᴍʏ ᴍᴀsᴛᴇʀ ✨🕯',
                    contacts: [{ vcard }]
                },
                mentions: [sender.jid]
            },
            { quoted: message }
        ))
    }
}
