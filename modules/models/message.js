var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var Message = new Schema({
    chat_content: {
        type: Array,
        default: []
    }
});

//Export modules.
module.exports = mongoose.model("message", Message);