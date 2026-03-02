import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: Object},
    workspace: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    lastEditedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
},{
    timestamps: true
})

export default mongoose.model("Document", documentSchema)
