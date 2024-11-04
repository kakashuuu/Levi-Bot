import { BaseCommand, Command, Message } from '../../Structures'

@Command('cmods', {
    description: 'shows the co-mods of the bot',
    usage: 'cmods',
    category: 'core',
    exp: 10,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, message }: Message): Promise<void> => {
        const image = await this.client.utils.getBuffer('https://telegra.ph/file/0e3f99f0425cf64550cff.jpg')
        const MessageX = {
            image,
            caption: `[ 🏮𝗟𝗲𝘃𝗶 .𝗶𝗻𝗰 𝗖𝗼-𝗺𝗼𝗱𝘀🏮 ]\n\n\🎉𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 = 𝘿𝙖𝙨 𝗞𝘂𝗻\n\n🌟𝗟𝗶𝗻𝗸 = wa.me/+917003213983n\n🎉𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲= 𝗥𝗮𝘆 𝗦𝗲𝗻𝗽𝗮𝗶\n\n🌟𝗟𝗶𝗻𝗸 = wa.me/+919861494774\n\n🎉𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 = 𝙇𝙚𝙫𝙞\n\n🌟𝗟𝗶𝗻𝗸 wa.me/919389075196\n\n🍁𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲 = 𝗩𝗺𝗶𝗻𝗸𝗼𝗼𝗸\n\n🌈𝗟𝗶𝗻𝗸 (Private)\n\n📙𝗡𝗼𝘁𝗲 = 𝗨 𝗰𝗮𝗻 𝗰𝗼𝗻𝘁𝗮𝗰𝘁 𝗔𝗻𝘆 𝗼𝗻𝗲 𝗼𝗳 𝗼𝘂𝗿 𝗰𝗼-𝗺𝗼𝗱𝙨 𝘁𝗼 𝗮𝗱𝗱 𝘆𝗼𝘂 𝘁𝗼  𝗯𝗼𝘁 𝗴𝗿𝗼𝘂𝗽𝘀 \n\n🎉🏮𝗪𝗲 𝗮𝗹𝘄𝗮𝘆𝘀 𝘄𝗼𝗿𝗸 𝗳𝗼𝗿 𝘆𝗼𝘂𝗿 𝗯𝗲𝘁𝘁𝗲𝗿 𝗲𝘅𝗽𝗲𝗿𝗶𝗲𝗻𝗰𝗲 🏮❣️`
        }
        return void (await this.client.sendMessage(from, MessageX, {
            quoted: message
        }))
    }
}
