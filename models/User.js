var { Schema, model } = require('mongoose');

//validate email using 
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: [true, "This username is already in use. Please try a different one"],
            trim: true

        },
        email: {
            type: String,
            required: true,
            unique: [true, "This email is already in use"],
            validate: [validateEmail, "Please fill a valid email address"],
             // use REGEX to validate correct email
            //match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
)

// get total count of friends
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
})

var User = model("User", userSchema)
module.exports = User;