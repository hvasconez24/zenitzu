var { Schema, model } = require("mongoose")
var reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat')

var thoughtSchema = new Schema(
    {
        thoughtText:{
            type: String,
            required: true,
            minlength: [1, "You must enter at least one character"],
            maxlength: [280, "Tou must enter less than 280 characters"]
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
)

// get total count of reactions
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

var Thought = model("Thought", thoughtSchema)
module.exports = Thought;