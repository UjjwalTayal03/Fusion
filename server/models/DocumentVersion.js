import mongoose, { mongo } from "mongoose";

const documentVersionSchema = new mongoose.Schema({
    document: {type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true},
    content: {type: Object, required: true},
    editedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    message: {type: String, default: "Version Checkpoint"}
}, {
    timestamps: true
})

export default mongoose.model("DocumentVersion", documentVersionSchema)
