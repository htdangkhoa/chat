var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var Test = new Schema({
    chat_content: {
        type: Array,
        default: []
    }
});

//Export modules.
module.exports = mongoose.model("test", Test);