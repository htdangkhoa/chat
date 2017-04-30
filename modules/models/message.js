var mongoose = require("mongoose"),
    Schema = mongoose.Schema;

var Message = new Schema({
    room_id: {
        type: Array,
        default: []
    }
});