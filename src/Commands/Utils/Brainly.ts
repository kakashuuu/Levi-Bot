import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import axios from 'axios'

@Command('brainly', {
    aliases: ['br'],
    description: 'Gives you answer of the question from brainly ',
    category: 'utils',
    usage: `brainly [Q]`,
    cooldown: 5,
    exp: 50,
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('Please provide me the question')
        const place = context.trim()
        await axios
            .get(`https://api.zekais.com/brainly?query=${place}&lang=us&apikey=CnXf9Ojs`)
            /* Note
  If you want to add some response, we'd recommend you to explore the json itself which provided link returns.
  This stability of the url and API KEY is not guaranteed.
  Regards: Team Kaoi
 */
            .then((response) => {
                // console.log(response);
                const i = Math.floor(Math.random() * response.data.result[0].answer.length)
                const text = `🔎 *Question*: *${place}*\n\n_*Answer*_ : ${response.data.result[0].answer[i].answer}\n `
                M.reply(text)
            })
            .catch((err) => {
                M.reply(`Sorry, couldn't find any Answers.`)
            })
    }
}
