import { BaseCommand, Command, Message } from '../../Structures';
import os from 'os';

@Command('info', {
    description: "Displays bot's info",
    usage: 'info',
    category: 'core',
    cooldown: 10,
    exp: 100
})
export default class InfoCommand extends BaseCommand {
    private thumbnailUrls: string[] = [
        'https://telegra.ph/file/2f994bb3744035c8deaa8.jpg',
        'https://telegra.ph/file/03a28fbb9f4d23e4c8101.jpg',
        'https://telegra.ph/file/03a28fbb9f4d23e4c8101.jpg',
        'https://telegra.ph/file/c6c0026ee5bb43b438fc6.jpg',
        'https://telegra.ph/file/5b8a25076bc512dff9367.jpg',
        'https://telegra.ph/file/921d65967aea629110029.jpg',
    ];

    private getRandomThumbnailUrl(): string {
        const randomIndex = Math.floor(Math.random() * this.thumbnailUrls.length);
        return this.thumbnailUrls[randomIndex];
    }

    private botVersion: string = process.env.npm_package_version || 'Unknown';

    private readonly ownerInfo = {
        name: '*Master Kakashi*',
    };

    public override execute = async ({ reply, sender }: Message): Promise<void> => {      
        let getGroups = await this.client.groupFetchAllParticipating();
        const users = await this.client.DB.user.find({})
        let groups = Object.entries(getGroups)
            .slice(0)
            .map((entry) => entry[1]);
        console.log(groups.length);

        const uptime = this.client.utils.formatSeconds(process.uptime());
        const cpuUsage = this.getCPUUsage();
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
        const currentDateUTC = new Date().toUTCString();
        const thumbnailUrl = this.getRandomThumbnailUrl();
        const clientJid = sender?.jid || ''; // Use a default empty string if sender is undefined

        const text = `*⛩️❯─「${this.client.config.name}」─❮⛩️*\n\n🚀 *Commands:* ${this.handler.commands.size}\n\n🚦 *Uptime:* ${uptime}\n\n🌑 Users = ${users.length}\n\n👽 *Mods:* ${this.client.config.mods.length}\n\n🛡 *Groups:* ${groups.length}\n\n💻 *Memory Used:* ${memoryUsage.toFixed(2)} MB\n\n🖥️ *CPU Usage:* ${cpuUsage}%\n\n🤖 *Bot Version:* 5.0\n\n👤 *Bot Owner:* ${this.ownerInfo.name}`;

        return void (await reply(text, 'text', undefined, undefined, undefined, [clientJid], {
            title: this.client.utils.capitalize(`Ｉ Ｎ Ｆ Ｏ Ｒ Ｍ Ａ Ｔ Ｉ Ｏ Ｎ`),
            thumbnail: await this.client.utils.getBuffer(thumbnailUrl),
            mediaType: 1
        }));
    };

    private getCPUUsage(): number {
        const cpuCount = os.cpus().length;
        const load = os.loadavg()[0];
        const usage = (100 * (load / cpuCount)).toFixed(2);
        return parseFloat(usage);
    }
    }
