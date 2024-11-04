import { BaseCommand, Command, Message } from '../../Structures'

@Command('work', {
    description: 'Do some work and earn Golds',
    category: 'economy',
    usage: 'kaam',
    exp: 5
})
export default class WorkCommand extends BaseCommand {
    override execute = async (message: Message): Promise<void> => {
        try {
            const { sender } = message
            const earnedCredits = Math.floor(Math.random() * 100) + 1
            await this.client.DB.setMoney(sender.jid, earnedCredits)
            let replyText = ''
            if (earnedCredits <= 20) {
                replyText = `You did some work and earned ${earnedCredits} Golds. Keep it up!`
            } else if (earnedCredits <= 50) {
                replyText = `Nice job! You earned ${earnedCredits} Golds for your hard work.`
            } else {
                replyText = `Amazing work! You earned ${earnedCredits} Golds. Keep going!`
            }

            return void message.reply(replyText)
        } catch (error) {
            console.error('Error while processing work command:', error)
            return void message.reply('An error occurred while trying to work.')
        }
    }
}
