import { BaseCommand, Command, Message } from '../../Structures'

@Command('weekly', {
    category: 'economy',
    description: 'get the weekly gold',
    usage: 'weekly',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const pad = (s: number): string => (s < 10 ? '0' : '') + s;
        const formatTime = (milliseconds: number): string => {
            const seconds = Math.floor(milliseconds / 1000);
            const days = Math.floor(seconds / (24 * 3600));
            const remainingSeconds = seconds % (24 * 3600);
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const remainingSecs = remainingSeconds % 60;

            return `*${days} day(s), ${pad(hours)} hour(s), ${pad(minutes)} minute(s), ${pad(remainingSecs)} second(s)*`;
        };

        const time = 7 * 86400000; 
        const { lastWeekly: cd } = await this.client.DB.getUser(M.sender.jid);

        if (time - (Date.now() - cd) > 0) {
            const timeLeft = formatTime(time - (Date.now() - cd));
            return void M.reply(`🟨 You claimed your weekly  already. Claim again in ${timeLeft}`);
        }

        await this.client.DB.setMoney(M.sender.jid, 10000);
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { lastWeekly: Date.now() } });
        
        return void (await M.reply('🎉 Claimed *10000 Golds*'));
    };
            }
        
