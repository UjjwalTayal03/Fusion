import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase},
    password: {type: String, required: true, select: false},

    role: {type: String, enum:["owner", "read", "write"], default: "read"},
    avatar: {type: String, default: ""},

    refreshToken: {type: String, default: ""}
},{
    timestamps: true
})

export default mongoose.model("User", userSchema)