import { IArgs } from '.'
import { Client, Message } from '../Structures'
import { MessageHandler } from '../Handlers'

export interface ICommand {
    /**Name of the command */
    name: string
    /**The client of WhatsApp */
    client: Client
    /**Handler of message */
    handler: MessageHandler
    /**Configuration of the command */
    config: ICommandConfig
    /**Method for executing the command */
    execute(M: Message, args: IArgs): Promise<void | never>
}

interface ICommandConfig {
    category: TCategory
    description: string
    usage: string    
    cooldown?: number
    aliases?: string[]
    exp?: number
    react?: string
    dm?: boolean
    casino?: boolean
    adminRequired?: boolean
    antiBattle?: boolean
    antiTrade?: boolean
}

export type TCategory =
    | 'dev'
    | 'fun'
    | 'games'
    | 'nsfw'
    | 'coding'
    | 'utils'
    | 'pokemon'
    | 'cards'
    | 'moderation'
    | 'weeb'
    | 'core'
    | 'shop'
    | 'media'
    | 'economy'
    | 'characters'
    | 'rpg'
    | 'Girls×pics'
