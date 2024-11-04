import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { createCanvas, loadImage } from 'canvas'
import { join } from 'path'
import moment from 'moment'

@Command('tweet', {
    description: 'Tweets a text in twitter',
    category: 'fun',
    exp: 25,
    cooldown: 15,
    aliases: ['twitter'],
    usage: 'tweet [text]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void (await M.reply(`Provide the text to tweet`))
        //@ts-ignore
        const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
            return new Promise((resolve) => {
                if (ctx.measureText(text).width < maxWidth) return resolve([text])
                if (ctx.measureText('W').width > maxWidth) return resolve(null)
                const words = text.split(' ')
                const lines = []
                let line = ''
                while (words.length > 0) {
                    let split = false
                    while (ctx.measureText(words[0]).width >= maxWidth) {
                        const temp = words[0]
                        words[0] = temp.slice(0, -1)
                        if (split) {
                            words[1] = `${temp.slice(-1)}${words[1]}`
                        } else {
                            split = true
                            words.splice(1, 0, temp.slice(-1))
                        }
                    }
                    if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
                        line += `${words.shift()} `
                    } else {
                        lines.push(line.trim())
                        line = ''
                    }
                    if (words.length === 0) lines.push(line.trim())
                }
                return resolve(lines)
            })
        }
        const formatNumberK = (number: number) =>
            number > 999 ? `${(number / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K` : number
        let pfp!: Buffer
        try {
            pfp = await this.client.utils.getBuffer((await this.client.profilePictureUrl(M.sender.jid, 'image')) || '')
        } catch {
            pfp = await this.client.utils.getBuffer(
                'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Kawaii_robot_power_clipart.svg/640px-Kawaii_robot_power_clipart.svg.png'
            )
        }
        const avatar = await loadImage(pfp)
        const base1 = await loadImage(this.client.assets.get('bg-1') as Buffer)
        const base2 = await loadImage(this.client.assets.get('bg-2') as Buffer)
        const canvas = createCanvas(base1.width, base1.height + base2.height)
        const ctx = canvas.getContext('2d')
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        const text = context.trim()
        const lines = (await wrapText(ctx, text, 710)) as any
        const lineBreakLen = text.split('\n').length
        const linesLen = 23 * lines.length + 23 * (lineBreakLen - 1) + 9 * (lines.length - 1) + 9 * (lineBreakLen - 1)
        canvas.height += linesLen
        const likes = Math.floor(Math.random() * 100000) + 1
        const retweets = Math.floor(Math.random() * 100000) + 1
        const quoteTweets = Math.floor(Math.random() * 100000) + 1
        const replies = Math.floor(Math.random() * 100000) + 1
        ctx.fillStyle = '#15202b'
        ctx.fillRect(0, base1.height, canvas.width, linesLen)
        ctx.drawImage(base1, 0, 0)
        const base2StartY = base1.height + linesLen
        ctx.drawImage(base2, 0, base2StartY)
        ctx.textBaseline = 'top'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillStyle = 'white'
        ctx.fillText(M.sender.username, 105, 84)
        const verified = await loadImage(this.client.assets.get('verified') as Buffer)
        const nameLen = ctx.measureText(M.sender.username).width
        ctx.drawImage(verified, 105 + nameLen + 4, 88, 18, 18)
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillStyle = '#8899a6'
        ctx.fillText(`@${M.sender.username.toLowerCase().split(' ')[0]}`, 106, 111)
        ctx.fillStyle = 'white'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillText(lines.join('\n'), 32, 164)
        ctx.fillStyle = '#8899a6'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        const time = moment().format('h:mm A ∙ MMMM D, YYYY ∙')
        ctx.fillText(time, 31, base2StartY + 16)
        const timeLen = ctx.measureText(time).width
        ctx.fillStyle = '#1b95e0'
        ctx.fillText('Twitter for iPhone', 31 + timeLen + 6, base2StartY + 16)
        ctx.fillStyle = '#8899a6'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillText(formatNumberK(replies) as string, 87, base2StartY + 139)
        ctx.fillText(formatNumberK(likes) as string, 509, base2StartY + 139)
        ctx.fillText(formatNumberK(retweets + quoteTweets) as string, 300, base2StartY + 139)
        let currentLen = 31
        ctx.fillStyle = 'white'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillText(formatNumberK(retweets) as string, currentLen, base2StartY + 77)
        currentLen += ctx.measureText(formatNumberK(retweets) as string).width
        currentLen += 5
        ctx.fillStyle = '#8899a6'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillText('Retweets', currentLen, base2StartY + 77)
        currentLen += ctx.measureText('Retweets').width
        currentLen += 10
        ctx.fillStyle = 'white'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillText(formatNumberK(quoteTweets) as string, currentLen, base2StartY + 77)
        currentLen += ctx.measureText(formatNumberK(quoteTweets) as string).width
        currentLen += 5
        ctx.fillStyle = '#8899a6'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillText('Quote Tweets', currentLen, base2StartY + 77)
        currentLen += ctx.measureText('Quote Tweets').width
        currentLen += 10
        ctx.fillStyle = 'white'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillText(formatNumberK(likes) as string, currentLen, base2StartY + 77)
        currentLen += ctx.measureText(formatNumberK(likes) as string).width
        currentLen += 5
        ctx.fillStyle = '#8899a6'
        ctx.font = join(__dirname, '..', '..', '..', 'assets', 'fonts', 'Noto-Regular.ttf')
        ctx.fillText('Likes', currentLen, base2StartY + 77)
        ctx.beginPath()
        ctx.arc(30 + 32, 84 + 32, 32, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(avatar, 30, 84, 64, 64)
        return void (await M.reply(canvas.toBuffer(), 'image'))
    }
}
