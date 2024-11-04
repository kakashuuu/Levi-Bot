import { AnyMessageContent, proto } from '@whiskeysockets/baileys'
import { PokemonClient } from 'pokenode-ts'
import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs, IPokemonAPIResponse } from '../../Types'

@Command('start-journey', {
    description: 'Starts Pokemon Journey',
    cooldown: 5,
    category: 'pokemon',
    exp: 10,
    usage: 'start-journey'
})
export default class extends BaseCommand {
    override execute = async (M: Message, { flags }: IArgs): Promise<void> => {
        const { party, companion } = await this.client.DB.getUser(M.sender.jid)
        if (companion !== 'None' || party.length >= 1)
            return void M.reply('You have already started your journey as a Pokemon trainer')
        if (!flags.length) {
            let text = 'Please choose one of the given Pokemon as your companion'
            const pokemon = {
                kanto: [1, 4, 7],
                johto: [152, 155, 158],
                hoenn: [252, 255, 258],
                sinnoh: [387, 390, 393],
                unova: [495, 498, 501],
                kalos: [650, 653, 656],
                aola: [722, 725, 728],
                galar: [810, 813, 816]
            }
            for (const region of Object.keys(pokemon)) {
                text += `${this.client.utils.capitalize(region)} Starter Pokemon\n\n`
                for (const pkmn of pokemon[region as 'galar']) {
                    let { name, types } = await this.client.utils.fetch<IPokemonAPIResponse>(
                        `https://pokeapi.co/api/v2/pokemon/${pkmn}`
                    )
                    name = this.client.utils.capitalize(name)
                    const type = this.client.utils.capitalize(types[0].type.name)
                    ;(text += `*🦊 PokemonName:* ${name}\n`),
                        (text += `*⭐ Type:* ${type}\n`),
                        (text += `*🎴 Use [ ${
                            this.client.config.prefix
                        }start-journey --${name.toLowerCase()} --choose ] To choose this pokemon as your first pokemon*\n\n`)
                }
            }
            return void (await M.reply(text, 'text'))
        } else if (!flags.includes('--choose')) {
            const res = await this.client.utils.fetch<IPokemonAPIResponse>(
                `https://pokeapi.co/api/v2/pokemon/${flags[0].replace('--', '')}`
            )
            let text = `*🎴Name:* ${this.client.utils.capitalize(res.name)}\n\n*🧧Pokedex ID:* ${res.id}\n\n*🔰${
                res.types.length > 1 ? 'Types' : 'Type'
            }:* ${res.types.map((type) => `${this.client.utils.capitalize(type.type.name)}`).join(', ')}\n\n*⚡${
                res.abilities.length > 1 ? 'Abilities' : 'Ability'
            }:* ${res.abilities.map((ability) => `${this.client.utils.capitalize(ability.ability.name)}`).join(', ')}`
            const client = new PokemonClient()
            const info = await client.getPokemonSpeciesByName(res.name)
            if (info.form_descriptions && info.form_descriptions.length > 0)
                text += `\n\n*📑Description:* ${info.form_descriptions[0].description}`
            const image = await this.client.utils.getBuffer(
                res.sprites.other['official-artwork'].front_default as string
            )
            const MessageX = {
                caption: text,
                image,
                jpegThumbnail: image.toString('base64'),
                contextInfo: {
                    externalAdReply: {
                        title: `${this.client.utils.capitalize(res.name)}`,
                        body: `${this.client.utils.capitalize(res.types[0].type.name)} Pokemon`,
                        thumbnail: image,
                        mediaType: 1
                    }
                }
            }
            return void (await this.client.sendMessage(M.from, MessageX as unknown as AnyMessageContent, {
                quoted: M.message
            }))
        } else {
            flags.splice(flags.indexOf('--choose'))
            await this.client.DB.updateUser(M.sender.jid, 'companion', 'set', flags[0].replace('--', ''))
            const pokemonLevelCharts = await this.client.utils.fetch<{ level: number; expRequired: number }[]>(
                'https://raw.githubusercontent.com/Levi-new-2024/smart-enhancer/main/envv'
            )
            const expArr = pokemonLevelCharts.filter((x) => x.level <= 5)
            const { expRequired: exp } = expArr[expArr.length - 1]
            const data = await this.client.utils.fetch<IPokemonAPIResponse>(
                `https://pokeapi.co/api/v2/pokemon/${flags[0].replace('--', '')}`
            )
            const image = data.sprites.other['official-artwork'].front_default as string
            const { hp, attack, defense, speed } = await this.client.utils.getPokemonStats(data.id, 5)
            const moves = await this.client.utils.getStarterPokemonMoves(data.name)
            const client = new PokemonClient()
            const { gender_rate } = await client.getPokemonSpeciesByName(data.name)
            let female = false
            if (gender_rate >= 8) female = true
            const genders = ['female', 'male']
            if (gender_rate < 8 && gender_rate > 0)
                female = genders[Math.floor(Math.random() * genders.length)] === 'female'
            party.push({
                name: data.name,
                level: 5,
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
                rejectedMoves: [],
                state: {
                    status: '',
                    movesUsed: 0
                },
                female,
                tag: '0'
            })
            await this.client.DB.updateUser(M.sender.jid, 'party', 'set', party)
            return void M.reply(
                `🎉 Congrats! You have just started your journey as a Pokemon trainer with your companion *${this.client.utils.capitalize(
                    flags[0].replace('--', '')
                )}*.`
            )
        }
    }
}
