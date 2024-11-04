import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import axios from 'axios'

@Command('why', {
    description: 'Will send you random question.',
    aliases: ['questions'],
    category: 'fun',
    usage: `why`,
    cooldown: 5,
    exp: 30
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        await axios
            .get(`https://nekos.life/api/v2/why`)
            .then((response) => {
                // console.log(response);
                const text = `📮 *Why:* ${response.data.why}`
                M.reply(text)
            })
            .catch((err) => {
                M.reply(`✖  An error occurred.`)
            })
    }
}

