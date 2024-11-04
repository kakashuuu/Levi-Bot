import { BaseCommand, Command, Message } from '../../Structures';

@Command('bank', {
    description: '',
    usage: 'bank',
    category: 'economy',
    exp: 10,
    cooldown: 10
})
export default class BankCommand extends BaseCommand {
    private thumbnailUrls: string[] = [
        'https://telegra.ph/file/5809026b770e84ba35cde.jpg',
        'https://telegra.ph/file/9dc3ea61f345b99b51128.jpg',
        'https://telegra.ph/file/efe974c530a064b6ec2f8.jpg',
        'https://telegra.ph/file/0034703c4943bf200b386.jpg',
        'https://telegra.ph/file/3323b5e81f9fed39138ac.jpg',
    ];

    private getRandomThumbnailUrl(): string {
        const randomIndex = Math.floor(Math.random() * this.thumbnailUrls.length);
        return this.thumbnailUrls[randomIndex];
    }

    override execute = async ({ reply, sender }: Message): Promise<void> => {
        const { bank, tag } = await this.client.DB.getUser(sender.jid);
        const thumbnailUrl = await this.getRandomThumbnailUrl();
        return void (await reply(`🧧𝗧𝗮𝗴 = #${tag}\n\n🏦 *Bank | ${sender.username}*\n\n*🪙 Gold ${bank}*\n`, 'text', undefined, undefined, undefined, [sender.jid], {
          title: this.client.utils.capitalize(`𝗟𝗲𝘃𝗶 𝗜𝗻𝗰 𝟮𝟬𝟮𝟰`),
            thumbnail: await this.client.utils.getBuffer(thumbnailUrl),
            mediaType: 1
        }));
    }
                              }
