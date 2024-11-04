import { BaseCommand, Command, Message } from '../../Structures';

@Command('wallet', {
    description: '',
    usage: 'wallet',
    category: 'economy',
    exp: 10,
    cooldown: 10
})
export default class WalletCommand extends BaseCommand {
    private thumbnailUrls: string[] = [
        'https://telegra.ph/file/115b54af36c7ab4fc2e59.jpg',
        'https://telegra.ph/file/0e1d2780d6cf5afbfcbec.jpg',
        'https://telegra.ph/file/ed3f9d8d6bca38f123c24.jpg',
        'https://telegra.ph/file/7e926d11ee923a511872a.jpg',
        'https://telegra.ph/file/2ec8a77af75daf2deed43.jpg',
    ];

    private getRandomThumbnailUrl(): string {
        const randomIndex = Math.floor(Math.random() * this.thumbnailUrls.length);
        return this.thumbnailUrls[randomIndex];
    }

    override execute = async ({ reply, sender, message }: Message): Promise<void> => {
        const { wallet, tag } = await this.client.DB.getUser(sender.jid);
        const thumbnailUrl = await this.getRandomThumbnailUrl();
        return void (await reply(` *🧧Tag:* #${tag}\n\n*👛 Wallet | ${sender.username}*\n\n*🪙 Gold: ${wallet}*\n`, 'text', undefined, undefined, undefined, [sender.jid], {
            title: this.client.utils.capitalize(`©️ 𝗟𝗲𝘃𝗶 𝗜𝗻𝗰 𝟮𝟬𝟮𝟰`),
            thumbnail: await this.client.utils.getBuffer(thumbnailUrl),
            mediaType: 1
        }));
    }
            }
