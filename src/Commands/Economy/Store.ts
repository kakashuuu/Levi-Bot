import { BaseCommand, Command, Message } from '../../Structures';

interface StoreItem {
    id: number;
    name: string;
    emoji: string;
    description: string;
    price: number;
}

@Command('store', {
    description: 'Shows the available items in the store',
    aliases: ['shop'],
    cooldown: 15,
    exp: 10,
    category: 'economy',
    usage: 'store'
})
export default class StoreCommand extends BaseCommand {
    private storeItems: StoreItem[] = [
        { id: 1, name: 'Protection Charm', emoji: '🎐', description: 'Charm to protect user from getting robbed', price: 5000000 },
        { id: 2, name: 'Gold Charm', emoji: '⚜️', description: 'Charm to increase gold acquisition', price: 35000000 },
        { id: 3, name: 'Experience Charm', emoji: '🔮', description: 'Charm to boost user experience gain', price: 25000000 },
    ];

    private storeName = '*🏬 Magical Charms Store 🏬*';

    override execute = async ({ from, message }: Message): Promise<void> => {
        let text = `${this.storeName}!\n\n`;

        for (const { id, name, emoji, description, price } of this.storeItems) {
            text += `*#${id} ${name}*\n`;
            text += `💬 *Description:* ${description}\n`;
            text += `🔖 *Price:* ${price}\n\n`;
        }

        text += `\n📕 *Note:* Use *${this.client.config.prefix}buy <item_index_number>* to buy an item\n`;

        return void (await this.client.sendMessage(
            from,
            {
                text
            },
            {
                quoted: message
            }
        ));
    }
}
