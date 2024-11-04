import { Command, BaseCommand, Message } from '../../Structures';
import { IArgs, IGroup } from '../../Types';
import { getStats } from '../../lib';

@Command('leaderboard', {
    description: "Displays global's or group's leaderboard of a specific field",
    category: 'core',
    usage: 'leaderboard (--group) [--pokemon | --cards | --wallet | --bank | --gold | --quiz]',
    exp: 10,
    cooldown: 25,
    aliases: ['lb']
})
export default class extends BaseCommand {
    override execute = async (M: Message, { flags }: IArgs): Promise<void> => {
        let users = await this.client.DB.user.find({});
        let head = `global `;
        const thumbnails: string[] = [
            'https://telegra.ph/file/2f994bb3744035c8deaa8.jpg',
            'https://telegra.ph/file/03a28fbb9f4d23e4c8101.jpg',
            'https://telegra.ph/file/03a28fbb9f4d23e4c8101.jpg',
            'https://telegra.ph/file/c6c0026ee5bb43b438fc6.jpg',
            'https://telegra.ph/file/5b8a25076bc512dff9367.jpg',
            'https://telegra.ph/file/921d65967aea629110029.jpg'
        ]
        if (flags.includes('--group')) {
            if (!M.groupMetadata)
                return void setTimeout(async () => await this.execute(M, { flags, context: '', args: [] }), 3000);
            users = [];
            head = `group `;
            const { participants } = M.groupMetadata as IGroup;
            for (const participant of participants) (users as any).push(await this.client.DB.getUser(participant.id));
            flags.splice(flags.indexOf('--group'), 1);
        }
        const sortArray = (): void => {
            if (flags.length < 1) {
                users.sort((a, b) => b.experience - a.experience);
                return;
            }
            for (const flag of flags) {
                switch (flag) {
                    case '--money':
                        head += 'money';
                        users.sort((a, b) => b.wallet - a.wallet + (b.bank - a.bank));
                        return;
                    case '--wallet':
                        head += 'wallet';
                        users.sort((a, b) => b.wallet - a.wallet);
                        return;
                    case '--bank':
                        head += 'bank';
                        users.sort((a, b) => b.bank - a.bank);
                        return;
                    case '--pokemon':
                        head += 'pokemon';
                        users.sort((a, b) => b.party.length - a.party.length + (b.pc.length - a.pc.length));
                        return;
                    case '--cards':
                        head += 'cards';
                        users.sort(
                            (a, b) =>
                                b.deck.length - a.deck.length + (b.cardCollection.length - a.cardCollection.length)
                        );
                        return;
                    case '--quiz':
                        head += 'quiz';
                        users.sort((a, b) => b.quizWins - a.quizWins);
                        return;
                    default:
                        users.sort((a, b) => b.experience - a.experience);
                        return;
                }
            }
        };
        sortArray();
        users = users.filter(user => !this.client.config.mods.includes(user.jid))
        let text = `🧧 *${head.toUpperCase()} LEADERBOARD* 🧧\n`;
        const n = users.length < 10 ? users.length : 10;
        for (let i = 0; i < n; i++) {
            let { username } = this.client.contact.getContact(users[i].jid);
            if (users[i].username?.custom) username = users[i].username.name as string;
            text += `\n*#${i + 1}*\n*🏮Username:* ${username}#${users[i].tag}\n*⭐Experience:* ${
                users[i].experience
            }\n*🏅Rank:* ${getStats(users[i].level).rank}\n*💰Money:* ${users[i].wallet + users[i].bank}\n*🏦Bank:* ${
                users[i].bank
            }\n*💳Wallet:* ${users[i].wallet}\n*🀄Total Pokemon:* ${
                users[i].party.length + users[i].pc.length
            }\n*🃏Cards:* ${users[i].deck.length + users[i].cardCollection.length}\n☄ *Characters:* ${
                users[i].gallery.length
            }\n*🍀Quiz Wins:* ${users[i].quizWins}\n`;
        }
        const imageUrl = thumbnails[Math.floor(Math.random() * thumbnails.length)]
        const buffer = await this.client.utils.getBuffer(imageUrl)
        return void M.reply(buffer, 'image', undefined, undefined, text)
    }
}
