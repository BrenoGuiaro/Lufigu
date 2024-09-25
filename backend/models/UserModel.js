import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    password: {
        type: String,
        required: function () { return !this.isGoogleUser; }
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    }
});

const User = model('User', userSchema);

export default User;
