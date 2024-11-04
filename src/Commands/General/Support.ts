import { BaseCommand, Command, Message } from '../../Structures'

@Command('levigclinks', {
    description: 'shows the co-mods of the bot',
    usage: 'lgl',
    category: 'core',
    exp: 10,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async ({ from, sender, message }: Message): Promise<void> => {
        const image = await this.client.utils.getBuffer('https://telegra.ph/file/b07d9c355744f801a9eb5.jpg')
        const MessageX = {
            image,
            caption: `[ 𝗔𝗹𝗹 𝗚𝗿𝗼𝘂𝗽 𝗟𝗶𝗻𝗸𝘀 𝗢𝗳 𝗟𝗲𝘃𝗶. 𝗜𝗻𝗰  ]\n\n*⛩️🍃 ʜɪᴅᴅᴇɴ ʟᴇᴀғ ᴠɪʟʟᴀɢᴇ 🍃*\n\nhttps://chat.whatsapp.com/FRRInctog4PEVRWQM6KRGe\n\n*🃏🎰  [ 𝙲𝙰𝚂𝙸𝙽𝙾 • 𝚉𝙾𝙽𝙴 ] 🃏🎰:*\nhttps://chat.whatsapp.com/DG5fX7M9b3EEDMMm8oRE8a\n\n*💦❄🔞 ʜᴇɴᴛᴀɪ ᴍᴜʟᴛɪᴠᴇʀsᴇ 💦🥵🤤:*\nhttps://chat.whatsapp.com/CVnKh0oCSC16Y2SuTod5Ba\n\n🃏🙋‍♂️ [ ¢αя∂ѕ αη∂ αυ¢тιση ] 🙋‍♂️🃏\nhttps://chat.whatsapp.com/Bdo1ROxInTd0K5uJcCIihz\n\n🏆 [ ρσкєχσηє Cσɱɱυɳιƚყ ] 🏆\nhttps://chat.whatsapp.com/Dyu8SGiUW6o7cScxO6m3Wr\n\n𝗠𝘂𝘀𝘁 𝗙𝗼𝗹𝗹𝗼𝘄 𝗔𝗹𝗹 𝗧𝗵𝗲 𝗥𝘂𝗹𝗲𝘀 𝗔𝗻𝗱 𝗘𝗻𝗷𝗼𝘆.`
        }
        return void (await this.client.sendMessage(from, MessageX, {
            quoted: message
        }))
    }
}
