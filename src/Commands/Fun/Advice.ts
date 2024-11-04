import { BaseCommand, Command, Message } from '../../Structures'

@Command('advice', {
    description: 'Sends a random advice',
    usage: 'advice',
    cooldown: 5,
    category: 'fun',
    exp: 20
})
export default class command extends BaseCommand {
    override execute = async ({ reply }: Message): Promise<void> => {
        const { slip } = await this.client.utils.fetch<{
            slip: {
                id: number
                advice: string
            }
        }>('https://api.adviceslip.com/advice')
        return void (await reply(slip.advice))
    }
}
