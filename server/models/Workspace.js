import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    permissions: {
        canEdit: {type: Boolean, default: false},
        canInvite: {type: Boolean, required: false},
        canDeleteDoc: {type: Boolean, required: false},
        canManageMembers: {type: Boolean, required: false}
    }
}, {
    _id: false
})

const workSpaceSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    members: {type: [memberSchema], default: []},
    inviteToken: {type: String},
    inviteExpiresAt: {type: Date},

    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    }]
},{
    timestamps: true
})

export default mongoose.model("Workspace", workSpaceSchema)