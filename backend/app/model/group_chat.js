

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const mongoosePaginate = require('mongoose-paginate');
    // const conn = app.mongooseDB.get('ava');
    var groupChatSchema = new mongoose.Schema({
        name: { type: String },
        members: [
            {
                openid: String,
                createdAt: { type: Date, default: Date.now },
                deleteStatus: { type: Boolean, default: false }
            }
        ],
        groupNumber: { type: String },
        createOpenid: { type: String },
        avator: { type: String },
        //-------Audit field-----------------------
        //create date
        createdAt: { type: Date },
        //update

        updatedAt: { type: Date, default: Date.now },
    }, { collection: 'group_chat' });
    groupChatSchema.plugin(mongoosePaginate);
    return mongoose.model('GroupChat', groupChatSchema);


}
