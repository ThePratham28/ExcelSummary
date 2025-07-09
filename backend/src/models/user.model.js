import { model, Schema } from "mongoose";

const User = new Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export const UserModel = model('User', User);