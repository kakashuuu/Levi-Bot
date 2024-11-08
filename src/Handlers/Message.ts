import { join } from 'path'
import { readdirSync } from 'fs-extra'
import chalk from 'chalk'
import { AnyMessageContent, proto, delay } from '@whiskeysockets/baileys'
import { schedule } from 'node-cron'
import { Message, Client, BaseCommand } from '../Structures'
import { getStats } from '../lib'
import { ICommand, IArgs, IPokemonAPIResponse, WaifuResponse, TCardsTier, IGroup } from '../Types'
import { Pokemon, Card, PokemonMove } from '../Database'
import { PokemonClient } from 'pokenode-ts'
import { ICharacter, Character } from '@shineiichijo/marika'
import Game from 'chess-node'
import axios from 'axios'

export class MessageHandler {
    constructor(private client: Client) {}

    public groups!: string[]

    public card: string[] = []

    public wild: string[] = []

    public chara: string[] = []

    public chess = {
        games: new Map<string, Game | undefined>(),
        challenges: new Map<string, { challenger: string; challengee: string } | undefined>(),
        ongoing: new Set<string>()
    }

    public charaResponse = new Map<string, { price: number; data: ICharacter }>()

    public loadCharaEnabledGroups = async (): Promise<void> => {
        const groups = !this.groups ? await this.client.getAllGroups() : this.groups
        for (const group of groups) {
            const data = await this.client.DB.getGroup(group)
            if (!data.chara) continue
            this.chara.push(group)
        }
        this.client.log(
            `Successfully loaded ${chalk.blueBright(`${this.chara.length}`)} ${
                this.chara.length > 1 ? 'groups' : 'group'
            } which has enabled chara`
        )
        await this.spawnChara()
    }

    private spawnChara = async (): Promise<void> => {
        schedule('*/5 * * * *', async () => {
            if (this.chara.length < 1) return void null
            for (let i = 0; i < this.chara.length; i++) {
                setTimeout(async () => {
                    const { chara, bot } = await this.client.DB.getGroup(this.wild[i])
                    if (bot !== 'all' && bot !== this.client.config.name.split(' ')[0]) return void null
                    if (!chara) return void null
                    await new Character()
                        .getRandomCharacter()
                        .then(async (chara) => {
                            const price = Math.floor(Math.random() * (50000 - 25000) + 25000)
                            let source = ''
                            await new Character()
                                .getCharacterAnime(chara.mal_id)
                                .then((res) => (source = res.data[0].anime.title))
                                .catch(async () => {
                                    await new Character()
                                        .getCharacterManga(chara.mal_id.toString())
                                        .then((res) => (source = res.data[0].manga.title))
                                        .catch(() => {})
                                })
                            const buffer = await this.client.utils.getBuffer(chara.images.jpg.image_url)
                            const MessageX = {
                                image: buffer,
                                jpegThumbnail: buffer.toString('base64'),
                                caption: `*A claimable character Appeared!*\n\n🏮 *Name: ${chara.name}*\n\n📑 *About:* ${chara.about}\n\n🌐 *Source: ${source}*\n\n💰 *Price: ${price}*\n\n*[Use ${this.client.config.prefix}claim to have this character in your gallery]*`
                            }
                            this.charaResponse.set(this.chara[i], { price, data: chara })
                            await this.client.sendMessage(this.chara[i], MessageX)
                        })
                        .catch(() => {})
                }, (i + 1) * 20 * 1000)
            }
        })
    }

    private spawnPokemon = async (): Promise<void> => {
        schedule('*/20 * * * *', async () => {
            if (this.wild.length < 1) return void null
            for (let i = 0; i < this.wild.length; i++) {
                setTimeout(async () => {
                    const { wild, bot } = await this.client.DB.getGroup(this.wild[i])
                    if (bot !== 'all' && bot !== this.client.config.name.split(' ')[0]) return void null
                    if (!wild) return void null
                    const id = Math.floor(Math.random() * 898)
                    const data = await this.client.utils.fetch<IPokemonAPIResponse>(
                        `https://pokeapi.co/api/v2/pokemon/${id}`
                    )
                    const level = Math.floor(Math.random() * (30 - 15) + 15)
                    const pokemonLevelCharts = await this.client.utils.fetch<{ level: number; expRequired: number }[]>(
                        'https://weeb-api.vercel.app/levels?key=Baka'
                    )
                   const expArr = pokemonLevelCharts.filter((x) => x.level <= level)
                    const exp = expArr[expArr.length - 1].expRequired
                    const image = data.sprites.other['official-artwork'].front_default as string
                    const { hp, attack, defense, speed } = await this.client.utils.getPokemonStats(data.id, level)
                    const { moves, rejectedMoves } = await this.client.utils.assignPokemonMoves(data.name, level)
                    const client = new PokemonClient()
                    const { gender_rate } = await client.getPokemonSpeciesByName(data.name)
                    let female = false
                    if (gender_rate >= 8) female = true
                    if (gender_rate < 8 && gender_rate > 0)
                        female = this.genders[Math.floor(Math.random() * this.genders.length)] === 'female'
                    this.pokemonResponse.set(this.wild[i], {
                        name: data.name,
                        level,
                        exp,
                        image,
                        id,
                        displayExp: 0,
                        hp,
                        attack,
                        defense,
                        speed,
                        maxHp: hp,
                        maxDefense: defense,
                        maxAttack: attack,
                        maxSpeed: speed,
                        types: data.types.map((type) => type.type.name),
                        moves,
                        rejectedMoves,
                        state: {
                            status: '',
                            movesUsed: 0
                        },
                        female,
                        tag: this.client.utils.generateRandomUniqueTag(10)
                    }) 
                    const buffer = await this.client.utils.getBuffer(image) 
                    await this.client.sendMessage(this.wild[i], {
                        image: buffer,
                        jpegThumbnail: buffer.toString('base64'),
                        caption: `🎊🎊 A Wild Pokemon Appeared!🎊🎊\n\n[Use *${this.client.config.prefix}catch <pokemon_name>* to catch this pokemon!]`
                    })
                }, (i + 1) * 45 * 1000)
            }
        })
    }

    public summonCard = async (jid: string, id: string): Promise<void> => {
        const url = `https://shoob.gg/cards/info/${id}`
        return await this.client.utils
            .fetch<{ title: string; src: string; source: string; tier: string }>('https://twilight-aurora.vercel.app/api/random')
            .then(async (data) => {
                const { title: name, src: image, source: description, tier: Tier } = data
                const tier = Tier.replace(/Tier|\s/g, '') as TCardsTier
                const prices = {
                  '1': [650, 1000],
                  '2': [1110, 1850],
                  '3': [2300, 3400],
                  '4': [4100, 5400],
                  '5': [7100, 9800],
                  '6': [18350, 24890],
                  'S': [37980, 54160]
                }
                const [min, max] = (prices[tier]) as [number, number]
                const price = Math.floor(Math.random() * (max - min) + min)
                this.cardResponse.set(jid, {
                    name,
                    id,
                    tier,
                    image,
                    url,
                    price,
                    description
                })
                let buffer = await this.client.utils.getBuffer(image)
                const type  = (image as string).endsWith('.gif') ? 'video' : 'image'
                if (type === 'video') buffer = await this.client.utils.gifToMp4(buffer)
                const text = `✨ *Details* ✨\n\n🃏 *Name:* ${name}\n🛡 *Description:* ${description}\n🎗 *Tier:* ${tier}\n💰 *Price:* ${price}\n\nUse *${this.client.config.prefix}collect* to get this card for yourself.`
                const MessageX = {
                    [type]: buffer,
                    caption:
                        tier !== 'S'
                            ? `🌟🎗 A Collectable Card Has Dropped! 🌟🎗\n\n${text}`
                            : `🃏 Woahh! An S tier Card Appeared! 😍\n\n${text}`
                }
                await this.client.sendMessage(jid, MessageX as unknown as AnyMessageContent)
            })
            .catch(async (err) => {
                return void (await this.client.sendMessage(jid, {
                    text: err.message
                }))
            })
    }

    public summonPokemon = async (
        jid: string,
        options: { pokemon: string | number; level?: number }
    ): Promise<void> => {
        const i = typeof options.pokemon === 'string' ? options.pokemon.toLowerCase() : options.pokemon.toString()
        const level = options.level ? options.level : Math.floor(Math.random() * (30 - 15)) + 15
        const pokemonLevelCharts = await this.client.utils.fetch<{ level: number; expRequired: number }[]>(
            'https://weeb-api.vercel.app/levels?key=Baka'
        )
        const expArr = pokemonLevelCharts.filter((x) => x.level <= level)
        const { expRequired: exp } = expArr[expArr.length - 1]
        const data = await this.client.utils.fetch<IPokemonAPIResponse>(`https://pokeapi.co/api/v2/pokemon/${i}`)
        if (!data.name)
            return void (await this.client.sendMessage(jid, {
                text: 'Invalid Pokemon name or ID'
            }))
        const image = data.sprites.other['official-artwork'].front_default as string
        const { hp, attack, defense, speed } = await this.client.utils.getPokemonStats(data.id, level)
        const { moves, rejectedMoves } = await this.client.utils.assignPokemonMoves(data.name, level)
        const client = new PokemonClient()
        const { gender_rate } = await client.getPokemonSpeciesByName(data.name)
        let female = false
        if (gender_rate >= 8) female = true
        if (gender_rate < 8 && gender_rate > 0)
            female = this.genders[Math.floor(Math.random() * this.genders.length)] === 'female'
        this.pokemonResponse.set(jid, {
            name: data.name,
            level,
            exp,
            image,
            id: data.id,
            displayExp: 0,
            hp,
            attack,
            defense,
            speed,
            maxHp: hp,
            maxDefense: defense,
            maxAttack: attack,
            maxSpeed: speed,
            types: data.types.map((type) => type.type.name),
            moves,
            rejectedMoves,
            state: {
                status: '',
                movesUsed: 0
            },
            female,
            tag: this.client.utils.generateRandomUniqueTag(10)
        })
        const buffer = await this.client.utils.getBuffer(image)
        return void (await this.client.sendMessage(jid, {
            image: buffer,
            jpegThumbnail: buffer.toString('base64'),
            caption: `A Wild Pokemon Appeared!\n\n[Use *${this.client.config.prefix}catch <pokemon_name>* to catch this pokemon!]`
        }))
    }

    public summonHaigusha = async (jid: string, slug: string): Promise<void> => {
        await this.client.utils
            .fetch<WaifuResponse>(`https://shooting-star-unique-api.vercel.app/api/mwl/character/slug/${slug}`)
            .then(async (haigusha) => {
                const appearances = haigusha.appearances as WaifuResponse['series'][]
                this.haigushaResponse.set(jid, haigusha)
                let text = `🎐 *Name:* ${haigusha.name}\n\n🎗 *Original Name:* ${haigusha.original_name}\n\n`
                if (haigusha.age && haigusha.age !== null) text += `🍀 *Age:* ${haigusha.age}\n\n`
                text += `🎀 *Gender:* ${haigusha.husbando ? 'Male' : 'Female'}\n\n🔗 *Appearance:* ${
                    haigusha.series !== null || haigusha.series ? haigusha.series?.name : appearances[0]?.name
                }\n\n❄ *Description:* ${haigusha.description}`
                const buffer = await this.client.utils.getBuffer(haigusha.display_picture as string)
                const MessageX = {
                    image: buffer,
                    jpegThumbnail: buffer.toString('base64'),
                    caption: text,
                    contextInfo: {
                        externalAdReply: {
                            title: haigusha.name,
                            mediaType: 1,
                            thumbnail: buffer,
                            sourceUrl: `https://mywaifulist.moe/waifu/${slug}`
                        }
                    }
                }
                await this.client.sendMessage(jid, MessageX as unknown as AnyMessageContent)
            })
            .catch(() => {
                return void null
            })
    }

    private spawnCard = async (): Promise<void> => {
        schedule('*/10 * * * *', async () => {
            console.log('⛩️🦖✨')
            if (this.card.length < 1) return void null
            for (let i = 0; i < this.card.length; i++) {
                setTimeout(async () => {
                    const { cards, bot } = await this.client.DB.getGroup(this.card[i])
                    if (bot !== 'all' && bot !== this.client.config.name.split(' ')[0]) return void null
                    if (!cards) return void null
                    const id = await this.client.utils.fetch<string>(
                        'https://weeb-api.vercel.app/random/card'
                    )
                    const url = `https://shoob.gg/cards/info/${id}`
                    await this.client.utils
                        .fetch<{ title: string; src: string; source: string; tier: string }>('https://twilight-aurora.vercel.app/api/random')
            .then(async (data) => {
                const { title: name, src: image, source: description, tier: Tier } = data
                            const tier = Tier.replace(/Tier|\s/g, '') as TCardsTier
                            const prices = {
                                '1': [650, 1000],
                                '2': [1110, 1850],
                                '3': [2300, 3400],
                                '4': [4100, 5400],
                                '5': [7100, 9800],
                                '6': [18350, 24890],
                                'S': [37980, 54160]
                            }
                            const [min, max] = (prices[tier]) as [number, number]
                            const price = Math.floor(Math.random() * (max - min) + min)
                            this.cardResponse.set(this.card[i], {
                                name,
                                id,
                                tier,
                                image,
                                url,
                                price,
                                description
                            })
                            let buffer = await this.client.utils.getBuffer(image)
                            const type  = (image as string).endsWith('.gif') ? 'video' : 'image'
                            if (type === 'video') buffer = await this.client.utils.gifToMp4(buffer)
                            const text = `💗 *Details* 💗\n\n👑 *Name:* ${name}\n📑 *Description:* ${description}\n✨ *Tier:* ${tier}\n💰 *Price:* ${price}\n\nUse *${this.client.config.prefix}collect* to get this card for yourself.`
                            const MessageX = {
                                [type]: buffer,
                                caption:
                                    tier !== 'S'
                                        ? `🌟🎗 A Collectable card Has Dropped! 🎗🌟\n\n${text}`
                                        : `🃏 Woahh! An S tier Card Appeared! 🃏\n\n${text}`
                            }
                            await this.client.sendMessage(this.card[i], MessageX as unknown as AnyMessageContent)
                        })
                        .catch(() => {
                            return void null
                        })
                }, (i + 1) * 48 * 1000)
            }
        })
    }

    public handleMessage = async (M: Message): Promise<void> => {
        const { prefix } = this.client.config
        const args = M.content.split(' ')
        const title = M.chat === 'dm' ? 'DM' : M.groupMetadata?.subject || 'Group'
        schedule('*/5 * * * *', async () => {
            this.client.utils.fetch<any>('https://levi-bot-op-8b895186d336.herokuapp.com/')
                .then(() => console.log('Ping Successful'))
                .catch((error: any) => console.error(error.message))
        })
        if (M.content.toLowerCase().trim() === 'test') return void M.reply('Everything is Working Fine. I guess! ')
        await this.isOfflineUser(M)
        await this.moderate(M)
        await this.client.readMessages([M.message.key])
        if (!args[0] || !args[0].startsWith(prefix))
            return void this.client.log(
                `${chalk.cyanBright('Message')} from ${chalk.yellowBright(M.sender.username)} in ${chalk.blueBright(
                    title
                )}`
            )
        this.client.log(
            `${chalk.cyanBright(`Command ${args[0]}[${args.length - 1}]`)} from ${chalk.yellowBright(
                M.sender.username
            )} in ${chalk.blueBright(title)}`
        )
        const { bot } = await this.client.DB.getGroup(M.from)
        const commands = ['switch', 'hello', 'hi', 'eval']
        const { ban, tag, inventory, companion } = await this.client.DB.getUser(M.sender.jid)
        if (!tag)
            await this.client.DB.updateUser(M.sender.jid, 'tag', 'set', this.client.utils.generateRandomUniqueTag())
        const cmd = args[0].toLowerCase().slice(prefix.length)
        if (bot != this.client.config.name.split(' ')[0] && bot !== 'all' && !commands.includes(cmd)) return void null
        if (ban.banned)
            return void M.reply(
                `🟥 You are banned from using commands.\n\n✔️Banned by *${ban.bannedBy}* at *${ban.bannedIn}* in *${ban.time} (GMT)*.\n\n📮Reason: *${ban.reason}*`
            )
        const command = this.commands.get(cmd) || this.aliases.get(cmd)
        if (!command) return void M.reply('No such command, Baka!')
        const disabledCommands = await this.client.DB.getDisabledCommands()
        const index = disabledCommands.findIndex((CMD) => CMD.command === command.name)
        if (index >= 0)
            return void M.reply(
                `🟥 *${this.client.utils.capitalize(cmd)}* is currently disabled by *${
                    disabledCommands[index].deniedBy
                }* on *${disabledCommands[index].time} (GMT)*.\n\n📮 *Reason:* ${disabledCommands[index].reason}`
            )
        if (M.chat === 'dm' && !command.config.dm) return void M.reply('This commmand can ONLY be used in groups!')
        if (command.config.category === 'moderation' && !M.sender.isAdmin)
            return void M.reply('This command can ONLY be used by the group admins!')
        if (command.config.antiTrade && this.userTradeSet.has(M.sender.jid))
            return void M.reply("You can't use this command right now as you created an ongoing card trade!")
        if (command.config.category === 'pokemon' && companion === 'None' && command.name !== 'start-journey')
            return void M.reply(`You haven't started your Pokemon journey yet. Use *${prefix}start-journey* to start`)
        if (command.config.category === 'pokemon' && command.name === 'challenge' && M.from !== '120363215222663843@g.us')
            return void M.reply("Bakano! You Can't Battle Here Join Our Battle Group To Battle\n\nLink🔗= http://gg.gg/Levi-Poke-battle-group")
        if (command.config.category === 'nsfw' && !(await this.client.DB.getGroup(M.from)).nsfw)
            return void M.reply('This comand can ONLY be used in NSFW enabled groups!')
        if (command.config.category === 'cards' && command.name === 'buy-card' && M.from !== '120363290332174345@g.us')
            return void M.reply("Abe gandu yaha nahi hoga claim khudko chalak mat samajh")
        if (command.config.category === 'dev' && !M.sender.isMod)
            return void M.reply('This command can ONLY be used by the MODS')          
        if (command.config.casino && M.from !== this.client.config.casinoGroup)
            return void M.reply(
                `This command can only be used in the casino group. Use ${this.client.config.prefix}support to get the casino group link`
            )
        const isAdmin = M.groupMetadata?.admins?.includes(this.client.correctJid(this.client.user?.id || ''))
        if (command.config.adminRequired && !isAdmin)
            return void M.reply('Cannot complete request as I am not an admin!')
        if (command.config.antiBattle && this.pokemonBattlePlayerMap.has(M.sender.jid))
            return void M.reply("You can't use this command now as you're in the midway of a battle with someone!")
        const cooldownAmount = (command.config.cooldown ?? 3) * 1000
        const time = cooldownAmount + Date.now()
        if (this.cooldowns.has(`${M.sender.jid}${command.name}`)) {
            const cd = this.cooldowns.get(`${M.sender.jid}${command.name}`)
            const remainingTime = this.client.utils.convertMs((cd as number) - Date.now())
            return void M.reply(
                `Woahh! Slow down. You can use this command again in *${remainingTime}* ${
                    remainingTime > 1 ? 'seconds' : 'second'
                }`
            )
        } else this.cooldowns.set(`${M.sender.jid}${command.name}`, time)
        setTimeout(() => this.cooldowns.delete(`${M.sender.jid}${command.name}`), cooldownAmount)
        let exp = command.config.exp ?? 10
        if (inventory.findIndex((x) => x.item === 'experience charm') > -1) exp = exp * 2
        await this.client.DB.setExp(M.sender.jid, exp)
        let money = Math.floor(Math.random() * 75)
        if (inventory.findIndex((x) => x.item === 'money charm') > -1) money = money * 2
        await this.client.DB.setMoney(M.sender.jid, money)
        await this.handleUserStats(M)
        try {
            await command.execute(M, this.formatArgs(args))
        } catch (error) {
            this.client.log((error as any).message, true)
        }
    }

    public isOfflineUser = async (M: Message): Promise<void> => {
        const { afk } = await this.client.DB.getUser(M.sender.jid)
        if (!afk) await this.client.DB.updateUser(M.sender.jid, 'afk', 'set', { isOffline: false })
        if (M.message.key.fromMe) return void null
        if (afk.isOffline) {
            await this.client.DB.updateOfflineStatus(M.sender.jid, false)
            return void M.reply(`${M.sender.username} is back to Online! \nTime you were AFK for ${afk.time}`)
        }
        if (M.quoted || M.mentioned.length) {
            const mentions = M.quoted ? [M.quoted.sender.jid] : M.mentioned
            for (const mention of mentions) { 
                const { username } = this.client.contact.getContact(mention)
                const { afk: info } = await this.client.DB.getUser(mention)
                if (info.isOffline)
                    return void M.reply(`${username} is afk!\nReason: ${info.reason}\nLast seen: ${info.time}`)
            }
        }
    }

    public pokemonEvolutionResponse = new Map<string, { group: string; pokemon: string }>()

    public loadWildEnabledGroups = async (): Promise<void> => {
        const groups = !this.groups ? await this.client.getAllGroups() : this.groups
        for (const group of groups) {
            const data = await this.client.DB.getGroup(group)
            if (!data.wild) continue
            this.wild.push(group)
        }
        this.client.log(
            `Successfully loaded ${chalk.blueBright(`${this.wild.length}`)} ${
                this.card.length > 1 ? 'groups' : 'group'
            } which has enabled wild`
        )
        await this.spawnPokemon()
    }

    public loadCardsEnabledGroups = async (): Promise<void> => {
        const groups = !this.groups ? await this.client.getAllGroups() : this.groups
        for (const group of groups) {
            const data = await this.client.DB.getGroup(group)
            if (!data.cards) continue
            this.card.push(group)
        }
        this.client.log(
            `Successfully loaded ${chalk.blueBright(`${this.card.length}`)} ${
                this.card.length > 1 ? 'groups' : 'group'
            } which has enabled cards`
        )
        await this.spawnCard()
    }

    private moderate = async (M: Message): Promise<void> => {
        if (M.chat !== 'group') {
            const urls = M.urls
            if (!urls.length) return void null
            const groupinvites = urls.filter((url) => url.includes('chat.whatsapp.com'))
            if (!groupinvites.length) return void null
            this.client.log(
                `${chalk.blueBright('GROUP REQUEST')} from ${chalk.yellowBright(
                    M.sender.username
                )} in ${chalk.cyanBright('DM')}`
            )
            const text = `*━━━❰ GROUP REQUEST ❱━━━*\n\n*🚀Request:* from *@${
                M.sender.jid.split('@')[0]
            }*\n\n*📃Message:* ${M.content}`
            if (M.message.key.fromMe) return void null
            await this.client.sendMessage(this.client.config.adminsGroup, {
                text,
                mentions: [M.sender.jid]
            })
            return void M.reply(
                '*❤✨ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ʜᴀs ʙᴇᴇɴ sᴇɴᴅ ɪ ᴡɪʟʟ ᴊᴏɪɴ sᴏᴏɴ ✨❤\n⭐ʀᴜʟᴇs\n\n👑 ɪ ᴡɪʟʟ ɴᴏᴛ ᴊᴏɪɴ ɪғ ᴜ ᴅᴏɴᴛ ɢɪᴠᴇ ᴍᴇ ᴀᴅᴍɪɴ ɪɴsᴛᴀɴᴛʟʏ\n🥰ʏᴏᴜʀ ɢʀᴏᴜᴘs ᴡɪʟʟ ʙᴇ ᴀᴅᴅᴇᴅ ᴛᴏ ᴏᴜʀ ᴄᴏᴍᴍᴜɴɪᴛʏ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ  ɪғ ᴊᴏɪɴᴇᴅ ᴀɴᴏᴛʜᴇʀ ᴛʜᴇɴ ʀᴇᴍᴏᴠᴇ ᴛʜᴇ ɢʀᴏᴜ ɴ ᴀᴅᴅ ᴛᴏ ᴜs😷\n💀ɢʀᴏᴜᴘ ᴀᴛʟᴇᴀsᴛ ʜᴀᴠᴇ 𝟸𝟻+ ᴍᴇᴍʙᴇʀs\n☃️ ɢʀᴏᴜᴘ ᴅᴏɴᴛ ʜᴀᴠᴇ ᴀɴʏ ᴏᴛʜᴇʀ ʙᴏᴛ ( ᴏᴘᴛɪᴏɴ ɴᴏᴛ ʀᴇǫᴜɪʀᴇᴅ) \n🌈 ɪғ ᴜ ᴅɪsʀᴇsᴘᴇᴄᴛ ʙᴏᴛ ᴏʀ ᴀʙᴜsᴇ ᴏᴜᴛ ᴀᴅᴍɪɴs ᴛʜᴇɴ ʙᴀɴ + ʀᴇᴍᴏᴠᴇ \n✨⭐❄ ɪғ ᴜ ғᴏʟʟᴏᴡɪɴɢ ᴛʜᴇsᴇ ʟᴇᴠɪ ᴡɪʟʟ. ᴊᴏɪɴ ɪɴsᴛᴀɴᴛʟʏ  ❤👀\n☃️ᴛʜᴀɴᴋs☃️\n🎴ᴛᴇᴀᴍ : ʟᴇᴠɪ. ɪɴᴄ 𝟸𝟶𝟸𝟹*'
            )
        }
        const { mods } = await this.client.DB.getGroup(M.from)
        if (
            !mods ||
            M.sender.isAdmin ||
            !M.groupMetadata?.admins?.includes(this.client.correctJid(this.client.user?.id || ''))
        )
            return void null
        const urls = M.urls
        if (urls.length > 0) {
            const groupinvites = urls.filter((url) => url.includes('chat.whatsapp.com'))
            if (groupinvites.length > 0) {
                groupinvites.forEach(async (invite) => {
                    const code = await this.client.groupInviteCode(M.from)
                    const inviteSplit = invite.split('/')
                    if (inviteSplit[inviteSplit.length - 1] !== code) {
                        const title = M.groupMetadata?.subject || 'Group'
                        this.client.log(
                            `${chalk.blueBright('MOD')} ${chalk.green('Group Invite')} by ${chalk.yellow(
                                M.sender.username
                            )} in ${chalk.cyanBright(title)}`
                        )
                        return void (await this.client.groupParticipantsUpdate(M.from, [M.sender.jid], 'remove'))
                    }
                })
            }
        }
    }

    public news: string[] = []

    private formatArgs = (args: string[]): IArgs => {
        args.splice(0, 1)
        return {
            args,
            context: args.join(' ').trim(),
            flags: args.filter((arg) => arg.startsWith('--'))
        }
    }

    public loadCommands = (): void => {
        this.client.log('Loading Commands...')
        const files = readdirSync(join(...this.path)).filter((file) => !file.startsWith('_'))
        for (const file of files) {
            this.path.push(file)
            const Commands = readdirSync(join(...this.path))
            for (const Command of Commands) {
                this.path.push(Command)
                const command: BaseCommand = new (require(join(...this.path)).default)()
                command.client = this.client
                command.handler = this
                this.commands.set(command.name, command)
                if (command.config.aliases) command.config.aliases.forEach((alias) => this.aliases.set(alias, command))
                this.client.log(
                    `Loaded: ${chalk.yellowBright(command.name)} from ${chalk.cyanBright(command.config.category)}`
                )
                this.path.splice(this.path.indexOf(Command), 1)
            }
            this.path.splice(this.path.indexOf(file), 1)
        }
        return this.client.log(
            `Successfully loaded ${chalk.cyanBright(this.commands.size)} ${
                this.commands.size > 1 ? 'commands' : 'command'
            } with ${chalk.yellowBright(this.aliases.size)} ${this.aliases.size > 1 ? 'aliases' : 'alias'}`
        )
    }

    private handleUserStats = async (M: Message): Promise<void> => {
        const { experience, level } = await this.client.DB.getUser(M.sender.jid)
        const { requiredXpToLevelUp } = getStats(level)
        if (requiredXpToLevelUp > experience) return void null
        await this.client.DB.updateUser(M.sender.jid, 'level', 'inc', 1)
    }

    public handlePokemonStats = async (
        M: Message,
        pkmn: Pokemon,
        inBattle: boolean,
        player: 'player1' | 'player2',
        user: string
    ): Promise<void> => {
        const learnableMove = await this.client.utils.getPokemonLearnableMove(
            pkmn.name,
            pkmn.level,
            pkmn.moves,
            pkmn.rejectedMoves
        )
        const jid = user
        await this.client.sendMessage(M.from, {
            mentions: [jid],
            text: `*@${jid.split('@')[0]}*'s ${this.client.utils.capitalize(pkmn.name)} grew to Level ${pkmn.level}`
        })
        await delay(2500)
        if (!learnableMove) return await this.handlePokemonEvolution(M, pkmn, inBattle, player, user)
        const { party } = await this.client.DB.getUser(jid)
        const i = party.findIndex((x) => x.tag === pkmn.tag)
        const { hp, speed, defense, attack } = await this.client.utils.getPokemonStats(pkmn.id, pkmn.level)
        pkmn.hp += hp - pkmn.maxHp
        pkmn.speed += speed - pkmn.speed
        pkmn.defense += defense - pkmn.defense
        pkmn.attack += attack - pkmn.attack
        pkmn.maxAttack = attack
        pkmn.maxSpeed = speed
        pkmn.maxHp = hp
        pkmn.maxDefense = defense
        party[i] = pkmn
        await this.client.DB.updateUser(jid, 'party', 'set', party)
        if (inBattle) {
            const data = this.pokemonBattleResponse.get(M.from)
            if (data && data[player].activePokemon.tag === pkmn.tag) {
                data[player].activePokemon = pkmn
                this.pokemonBattleResponse.set(M.from, data)
            }
        }
        const move = learnableMove.name
            .split('-')
            .map((move) => this.client.utils.capitalize(move))
            .join(' ')
        if (pkmn.moves.length < 4) {
            pkmn.moves.push(learnableMove)
            party[i] = pkmn
            if (inBattle) {
                const data = this.pokemonBattleResponse.get(M.from)
                if (data && data[player].activePokemon.tag === pkmn.tag) {
                    data[player].activePokemon = pkmn
                    this.pokemonBattleResponse.set(M.from, data)
                }
            }
            await this.client.DB.updateUser(jid, 'party', 'set', party)
            await this.client.sendMessage(M.from, {
                text: `*@${jid.split('@')[0]}*'s *${this.client.utils.capitalize(pkmn.name)}* learnt *${move}*`,
                mentions: [jid]
            })
            await delay(3000)
            return await this.handlePokemonEvolution(M, pkmn, inBattle, player, user)
        } else {
            let Text = `*⚔️Moves | ${this.client.utils.capitalize(pkmn.name)}\n*`
            for (const move of pkmn.moves) {
                Text += `*🧧Move* : ${move.name
                    .split('-')
                    .map((name) => this.client.utils.capitalize(name))
                    .join(' ')}\n*🌟Type*: ${this.client.utils.capitalize(move.type)}\n*🎐 PP* : ${move.maxPp}\n*👽 Power* : ${move.power}\n*⚓Accuracy* : ${move.accuracy}\n\n`
            }
            Text += `Use *${this.client.config.prefix}learn --cancel* if you don't want to learn ${move}`
            this.pokemonMoveLearningResponse.set(`${M.from}${jid}`, {
                move: learnableMove,
                data: pkmn
            })
            const text = `*@${jid.split('@')[0]}*, your Pokemon *${this.client.utils.capitalize(
                pkmn.name
            )}* is trying to learn *${move}*.\nBut a Pokemon can't learn more than 4 moves.\nDelete a move to learn this move by selecting one of the moves below.\n\n*[This will autometically be cancelled if you don't continue within 60 seconds]*`
            await this.client.sendMessage(M.from, {
                text,
                mentions: [jid]
            })
            await delay(1500)
            await this.client.sendMessage(M.from, {
                text: `📝 *Move Details*\n\n❓ *Move:* ${move}\n〽 *PP:* ${
                    learnableMove.maxPp
                }\n🎗 *Type:* ${this.client.utils.capitalize(learnableMove.type)}\n🎃 *Power:* ${
                    learnableMove.power
                }\n🎐 *Accuracy:* ${learnableMove.accuracy}\n🧧 *Description:* ${learnableMove.description}`
            })
            await delay(1500)
            await this.client.sendMessage(M.from, {
                text: Text
            })
            setTimeout(async () => {
                if (this.pokemonMoveLearningResponse.has(`${M.from}${jid}`)) {
                    this.pokemonMoveLearningResponse.delete(`${M.from}${jid}`)
                    party[i].rejectedMoves.push(learnableMove.name)
                    await this.client.DB.updateUser(jid, 'party', 'set', party)
                    await this.client.sendMessage(M.from, {
                        text: `*@${jid.split('@')[0]}*'s *${this.client.utils.capitalize(
                            pkmn.name
                        )}* Cancelled learning *${move}*`,
                        mentions: [jid]
                    })
                }
                return await this.handlePokemonEvolution(M, pkmn, inBattle, player, user)
            }, 6 * 10000)
        }
    }

    private handlePokemonEvolution = async (
        M: Message,
        pkmn: Pokemon,
        inBattle: boolean,
        player: 'player1' | 'player2',
        user: string
    ): Promise<void> => {
        const evolutions = await this.client.utils.getPokemonEvolutionChain(pkmn.name)
        if (evolutions.length < 1) return void null
        const pokemonEvolutionChain = await this.client.utils.fetch<IPokemonEvolutionChain[]>(
            'https://weeb-api.vercel.app/chain?key=Baka'
        )
        const chain = pokemonEvolutionChain.filter((x) => evolutions.includes(x.species_name))
        if (chain.length < 1) return void null
        const index = evolutions.findIndex((x) => x === pkmn.name) + 1
        if (!evolutions[index]) return void null
        const chainIndex = chain.findIndex((x) => x.species_name === evolutions[index])
        if (chainIndex < 0) return void null
        const pokemn = chain[chainIndex]
        if (pokemn.trigger_name !== 'level-up') return void null
        if (pokemn.min_level > pkmn.level) return void null
        if (this.pokemonEvolutionResponse.has(`${pkmn.name}${user}`)) return void null
        const text = `*${user.split('@')[0]}*, your Pokemon *${this.client.utils.capitalize(
            pkmn.name
        )}* is evolving to *${this.client.utils.capitalize(evolutions[index])}*. Use *${
            this.client.config.prefix
        }cancel-evolution* to cancel this evolution (within 60s)`
        const { party } = await this.client.DB.getUser(M.sender.jid)
        const i = party.findIndex((x) => x.tag === pkmn.tag)
        const MessageX = {
            text,
            mentions: [user]
        }
        await this.client.sendMessage(M.from, MessageX)
        this.pokemonEvolutionResponse.set(user, {
            group: M.from,
            pokemon: pkmn.name
        })
        setTimeout(async () => {
            if (!this.pokemonEvolutionResponse.has(M.sender.jid)) return void null
            this.pokemonEvolutionResponse.delete(M.sender.jid)
            const pData = await this.client.utils.fetch<IPokemonAPIResponse>(
                `https://pokeapi.co/api/v2/pokemon/${evolutions[index]}`
            )
            pkmn.id = pData.id
            pkmn.image = pData.sprites.other['official-artwork'].front_default as string
            pkmn.name = pData.name
            const { hp, attack, defense, speed } = await this.client.utils.getPokemonStats(pkmn.id, pkmn.level)
            pkmn.hp += hp - pkmn.maxHp
            pkmn.speed += speed - pkmn.speed
            pkmn.defense += defense - pkmn.defense
            pkmn.attack += attack - pkmn.attack
            pkmn.maxAttack = attack
            pkmn.maxSpeed = speed
            pkmn.maxHp = hp
            pkmn.maxDefense = defense
            if (pkmn.tag === '0') await this.client.DB.updateUser(user, 'companion', 'set', pData.name)
            party[i] = pkmn
            if (inBattle) {
                const data = this.pokemonBattleResponse.get(M.from)
                if (data && data[player].activePokemon.tag === pkmn.tag) {
                    data[player].activePokemon = pkmn
                    this.pokemonBattleResponse.set(M.from, data)
                }
            }
            await this.client.DB.updateUser(user, 'party', 'set', party)
            const buffer = await this.client.utils.getBuffer(pkmn.image)
            return void (await this.client.sendMessage(M.from, {
                image: buffer,
                jpegThumbnail: buffer.toString('base64'),
                caption: `Congrats! *@${user.split('@')[0]}*, your ${this.client.utils.capitalize(
                    evolutions[index - 1]
                )} has been evolved to ${this.client.utils.capitalize(pkmn.name)}`,
                mentions: [user]
            }))
        }, 6 * 10000)
    }

    public commands = new Map<string, ICommand>()

    public aliases = new Map<string, ICommand>()

    private cooldowns = new Map<string, number>()

    private path = [__dirname, '..', 'Commands']

    public quiz = {
        game: new Map<string, { answer: string; options: string[] }>(),
        timer: new Map<string, { id: NodeJS.Timer }>(),
        board: new Map<string, { players: { jid: string; points: number }[] }>(),
        answered: new Map<string, { players: string[] }>(),
        forfeitable: new Map<string, boolean>()
    }

    public pokemonResponse = new Map<string, Pokemon>()

    public pokemonTradeResponse = new Map<string, { offer: Pokemon; creator: string; with: string }>()

    public cardResponse = new Map<
        string,
        {
            price: number
            name: string
            tier: TCardsTier
            id: string
            image: string
            url: string
            description: string
        }
    >()

    public pokemonMoveLearningResponse = new Map<string, { move: PokemonMove; data: Pokemon }>()

    public cardTradeResponse = new Map<
        string,
        { creator: string; offer: Card; index: number; with: { name: string; tier: TCardsTier } }
    >()

    public auction = new Map<string, { price: number; card: Card; seller: string; position: number }>()

    public highestBit = new Map<string, { buyer: string; bit: number }>()

    public userTradeSet = new Set<string>()

    public haigushaResponse = new Map<string, WaifuResponse>()

    public pokemonBattleResponse = new Map<
        string,
        {
            player1: { user: string; ready: boolean; move: PokemonMove | 'skipped' | ''; activePokemon: Pokemon }
            player2: { user: string; ready: boolean; move: PokemonMove | 'skipped' | ''; activePokemon: Pokemon }
            turn: 'player1' | 'player2'
            players: string[]
        }
    >()

    public pokemonBattlePlayerMap = new Map<string, string>()

    public pokemonChallengeResponse = new Map<string, { challenger: string; challengee: string }>()

    public shop = new Map<string, { title: string; url: string; tier: string }[]>()

    private genders = ['female', 'male']
}

interface IPokemonEvolutionChain {
    species_name: string
    min_level: number
    trigger_name: 'level-up' | 'use-item' | null
    item: {
        name: string
        url: string
    } | null
}
