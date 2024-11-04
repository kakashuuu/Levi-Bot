import { createCanvas, Image, loadImage } from 'canvas'
import { join } from 'path'
import { Utils } from '.'

export class Canvas {
    constructor(private image: string | Buffer) {}

    public KidImage = async (): Promise<Buffer> => {
        const base = await loadImage(this.path)
        if (typeof this.image !== 'string' && !Buffer.isBuffer(this.image))
            throw new TypeError(
                `The image should be of type string or instance of Buffer. Recieved ${typeof this.image}`
            )
        if (typeof this.image === 'string') this.image = await this.utils.getBuffer(this.image)
        const data = await loadImage(this.image)
        const canvas = createCanvas(data.width, data.height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(data, 0, 0)
        const { x, y, width, height } = await this.centerImage(base, data)
        ctx.drawImage(base, x, y, width, height)
        return canvas.toBuffer()
    }

    public centerImage = (base: Image, data: Image) => {
        const dataRatio = data.width / data.height
        const baseRatio = base.width / base.height
        let { width, height } = data
        let x = 0
        let y = 0
        if (baseRatio < dataRatio) {
            height = data.height
            width = base.width * (height / base.height)
            x = (data.width - width) / 2
            y = 0
        } else if (baseRatio > dataRatio) {
            width = data.width
            height = base.height * (width / base.width)
            x = 0
            y = (data.height - height) / 2
        }
        return { x, y, width, height }
    }

    private path = join(__dirname, '..', '..', 'assets', 'images', 'kid.png')

    private utils = new Utils()
}
