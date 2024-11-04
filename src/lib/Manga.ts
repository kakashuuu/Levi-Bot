import { config } from 'dotenv'

config()

import PDF from 'pdfkit'
import { tmpdir } from 'os'
import { writeFile, readFile, unlink, createWriteStream } from 'fs-extra'
import MFA from 'mangadex-full-api'
import { Utils } from '.'

export class Manga {
    private utils = new Utils()

    constructor(private manga: string, private chapter: string | number) {
        const auth = process.env.MANGADEX_AUTH?.split(', ') || []
        MFA.login(auth[0], auth[1])
    }

    public build = async (): Promise<Buffer> => {
        if ((this.pages?.length as number) < 1) await this.savePages()
        const document = new PDF({ margin: 0, size: this.size })
        for (const image of this.pages as string[]) {
            const file = await this.download(image)
            this.files.push(file)
            document.image(file, 0, 0, {
                fit: this.size as [number, number],
                align: 'center',
                valign: 'center'
            })
            if (this.pages?.indexOf(image) === (this.pages?.length as number) - 1) break
            else document.addPage()
        }
        document.end()
        const stream = createWriteStream(this.filename)
        document.pipe(stream)
        await new Promise((resolve, reject) => {
            stream.on('finish', () => resolve(this.filename))
            stream.on('error', reject)
        })
        const buffer = await readFile(this.filename)
        await unlink(this.filename)
        for (const file of this.files) await unlink(file)
        return buffer
    }

    public getInfo = async (): Promise<Manga['info']> => {
        if ((this.pages?.length as number) < 1) await this.savePages()
        return this.info
    }

    public savePages = async (): Promise<Manga> => {
        let manga: MFA.Manga
        let chapters: MFA.Chapter[]
        try {
            manga = await MFA.Manga.getByQuery(this.manga)
        } catch (error) {
            this.pages = null
            return this
        }
        const Chapters = await manga.getFeed({ translatedLanguage: ['en'], order: { chapter: 'asc' }, limit: Infinity })
        chapters = Chapters.filter((chapter) => !chapter.isExternal) as MFA.Chapter[]
        const chapter = typeof this.chapter === 'number' ? this.chapter.toString() : this.chapter
        const index = chapters.findIndex((x) => x.chapter === chapter)
        if (index < 0) {
            this.pages = undefined
            return this
        }
        this.pages = (await chapters[index].getReadablePages()) as string[]
        this.info = {
            chapterTitle: chapters[index].title,
            chapter: chapters[index].chapter,
            pages: chapters[index].pages,
            cover: this.pages[0],
            mangaTitle: manga.title
        }
        return this
    }

    public validate = async (): Promise<{ valid: boolean; reason?: 'Invaild Manga' | 'Invalid Chapter' }> => {
        if ((this.pages?.length as number) < 1) await this.savePages()
        if (this.pages === null)
            return {
                valid: false,
                reason: 'Invaild Manga'
            }
        if (!this.pages)
            return {
                valid: false,
                reason: 'Invalid Chapter'
            }
        return {
            valid: true
        }
    }

    private download = async (url: string): Promise<string> => {
        const buffer = await this.utils.getBuffer(url)
        const arr = url.split('/')
        const type = arr[arr.length - 1].split('.')[1]
        const filename = `${tmpdir()}/${Math.random().toString(36)}.${type}`
        await writeFile(filename, buffer)
        return filename
    }

    private size = [595.28, 841.89]

    private filename = `${tmpdir()}/A4_${Math.random().toString()}.pdf`

    private pages: string[] | null | undefined = []

    private info!: {
        chapterTitle: string
        pages: number
        cover: string
        chapter: string
        mangaTitle: string
    }

    private files: string[] = []
}
