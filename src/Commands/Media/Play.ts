import { YT } from '../../lib'
import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs, YT_Search } from '../../Types'

const coolestMessages = [
    "Feel the rhythm and enjoy the beats! 🎶",
    "Unlock the musical magic within! 🌟",
    "Let the melody guide your soul! 🎵",
    "Embrace the sonic adventure! 🚀",
    "Your journey into sound begins now! 🎧",
    "Dance to the rhythm of joy! 💃",
    "Immerse yourself in the musical universe! 🌌",
    "Prepare for an audio delight! 🎶",
    "Groove to the sound waves! 🕺",
    "The beats await your presence! 🎵",
    "Embark on a musical escapade! 🎶",
    "Get ready for an auditory feast! 🍽️",
    "Let the vibes elevate your spirit! 🚀",
    "Feel the beats and let loose! 💫",
    "Musical enchantment incoming! 🌈",
    "Tune in to the rhythm of happiness! 🎧",
    "Your playlist just got cooler! ❄️",
    "Let the music paint your emotions! 🎨",
    "Dive into the sea of sounds! 🌊",
    "Turn up the volume and let it resonate! 🔊"
]

@Command('play', {
    description: 'Plays a song of the given term from YouTube',
    cooldown: 15,
    exp: 35,
    category: 'media',
    usage: 'play [term]'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Provide a term to play, Baka!')
        const term = context.trim()
        const coolestMessage = coolestMessages[Math.floor(Math.random() * coolestMessages.length)]
        M.reply(`*${coolestMessage}*`)
        
        const videos = await this.client.utils.fetch<YT_Search[]>(`https://weeb-api.vercel.app/ytsearch?query=${term}`)
        if (!videos || !videos.length) return void M.reply(`No matching songs found | *"${term}"*`)
        const buffer = await new YT(videos[0].url, 'audio').download()
        return void (await M.reply(buffer, 'document', undefined, 'audio/mpeg', undefined, undefined, {
            title: videos[0].title,
            thumbnail: await this.client.utils.getBuffer(videos[0].thumbnail),
            mediaType: 2,
            body: videos[0].description,
            mediaUrl: videos[0].url
        }, undefined, `${decodeURI(videos[0].title)}.mp3`))
    }
}
