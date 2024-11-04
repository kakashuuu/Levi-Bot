import { BaseCommand, Command, Message } from '../../Structures';

interface StoreItem {
    id: number;
    name: string;
    emoji: string;
    description: string;
    price: number;
}

@Command('buy', {
    description: 'Buys an item from the store',
    category: 'economy',
    usage: 'buy <item_index_number_in_the_store>',
    cooldown: 25,
    exp: 20
})
export default class BuyCommand extends BaseCommand {
    private maxProtectionCharmUsages = 10;

    private storeItems: StoreItem[] = [
        { id: 1, name: 'Protection Charm', emoji: '🎐', description: 'Charm to protect user from getting robbed', price: 55000 },
        { id: 2, name: 'Gold Charm', emoji: '⚜️', description: 'Charm to increase gold acquisition', price: 35000 },
        { id: 3, name: 'Experience Charm', emoji: '🔮', description: 'Charm to boost user experience gain', price: 25000 },
    ];

    override execute = async (M: Message): Promise<void> => {
        if (M.numbers.length < 1) {
            return void M.reply(`Provide the index number of the item in the store that you want to buy. Example: *${this.client.config.prefix}buy 2*`);
        }

        const index = parseInt(`${M.numbers[0]}`) - 1;

        if (index < 0 || index >= this.storeItems.length) {
            return void M.reply(`Invalid index of an item. Use *${this.client.config.prefix}store* to see all available items`);
        }

        const { name, description, price } = this.storeItems[index];
        const user = await this.client.DB.getUser(M.sender.jid);

        if (user.wallet < price) {
            return void M.reply(`🟥 *You need ${price - user.wallet} more golds to buy this item*`);
        }

        if (name === 'Protection Charm') {
            const existingProtectionCharms = user.inventory.filter(item => item.item === 'Protection Charm');
            const remainingUsages = this.maxProtectionCharmUsages - existingProtectionCharms.length;

            if (remainingUsages <= 0) {
                return void M.reply("🟥 *You can't have more Protection Charms. The limit is 10.*");
            }

            const protectionCharmUsages = Math.min(remainingUsages, 1); 
            user.inventory.push({ item: name, usageLeft: protectionCharmUsages });
        } else {
            user.inventory.push({ item: name, usageLeft: 1 });
        }

        await this.client.DB.updateUser(M.sender.jid, 'inventory', 'set', user.inventory);
        await this.client.DB.updateUser(M.sender.jid, 'wallet', 'inc', -price);

        return void M.reply(
            `You have bought ${name.startsWith('e') ? 'an' : 'a'} *${name
                .split(' ')
                .map((item) => this.client.utils.capitalize(item))
                .join(' ')}* for *${price} golds*`
        );
    }
}
