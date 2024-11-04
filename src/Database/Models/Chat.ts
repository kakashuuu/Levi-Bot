import { prop, getModelForClass } from '@typegoose/typegoose'
import { Document } from 'mongoose'

export class ChatSchema {
    @prop({ type: String, unique: true, required: true })
    public chat!: string

    @prop({ type: Boolean, required: true, default: false })
    public state!: boolean
}

export type TChatModel = ChatSchema & Document

export const chatSchema = getModelForClass(ChatSchema)
