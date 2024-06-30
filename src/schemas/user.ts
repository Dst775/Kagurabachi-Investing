import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    password: String, // Hashed
    balance: Number
});

export const User = mongoose.model('User', userSchema);