import axios from 'axios'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('crypto', {
    aliases: ['cr', 'coins'],
    description: 'Get Crypto Prices\n',
    category: 'utils',
    usage: 'crypto (Coin/Currency) (Currency/Coin) (count of 1st param)',
    exp: 15,
    cooldown: 20
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { args }: IArgs): Promise<void> => {
        args = args.map((x) => x.toUpperCase())
        let text = ''
        await axios
            .get(`https://public.coindcx.com/market_data/current_prices`)
            .then(async (res) => {
                if (!res) return void M.reply('ERROR\nThis might be due to API service being down')

                const data = res.data
                const count = args.length > 2 ? (isNaN(parseInt(args[2])) ? 1 : parseInt(args[2])) : 1
                if (args[0] === '') {
                    text = `*Crypto Prices*\n\n`
                    // loop over the array of key and value, and add them to the text
                    for (const [key, value] of Object.entries(data)) {
                        text += `*${key}*: ${value}\n`
                    }
                } else if (args.length == 1) {
                    // concat 'INR' to the args
                    args[0] = args[0] + 'INR'
                    // check if the value of the args is present in the data, if it's present then return the value
                    if (data[args[0]]) {
                        text = `*${args[0]}*: ${data[args[0]]}`
                    } else {
                        text = `*${args[0]}*: Not Found\nUsage example\n${this.client.config.prefix}cr BTC INR\n${this.client.config.prefix}cr USDT BTC\n${this.client.config.prefix}cr INR BTC\n${this.client.config.prefix}cr without parameters returns data on all coins`
                    }
                } else if (args.length == 2 || isNaN(count)) {
                    // concat args[1] to the args[0]
                    args[0] = args[0] + args[1]
                    // check if the value of the args is present in the data, if it's present then return the value
                    if (data[args[0]]) {
                        text = `*${args[0]}*: ${data[args[0]]}`
                    } else {
                        text = `*${args[0]}*: Not Found\nUsage example\n${this.client.config.prefix}cr BTC INR\n${this.client.config.prefix}cr USDT BTC\n${this.client.config.prefix}cr INR BTC\n${this.client.config.prefix}cr without parameters returns data on all coins`
                    }
                }
                // Get the value of the args[0] and multiply it by the args[2]
                // if (args.length == 3)
                else {
                    // concat args[1] to the args[0]
                    args[0] = args[0] + args[1]
                    // check if the value of the args is present in the data, if it's present then return the value
                    if (data[args[0]]) {
                        text = `*${args[0]}*: ${data[args[0]] * count}`
                    } else {
                        text = `*${args[0]}*: Not Found\nUsage example\n${this.client.config.prefix}cr BTC INR\n${this.client.config.prefix}cr USDT BTC\n${this.client.config.prefix}cr INR BTC\n${this.client.config.prefix}cr without parameters returns data on all coins`
                    }
                }
            })
            .catch((err) => {
                console.log(err)
                return void M.reply('ERROR\nThis might be due to API service being down')
            })

        return void M.reply(text)
    }
}
