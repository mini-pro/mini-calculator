

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const mongoosePaginate = require('mongoose-paginate');
    var userSchema = new mongoose.Schema({
        //user email
        email: { type: String },
        username: { type: String },
        password: { type: String },
        openid: { type: String },
        //user head image
        avator: { type: String },
        nickname: { type: String },
        country: { type: String },
        phoneCountryCode: { type: String },
        province: { type: String },
        city: { type: String },
        language: { type: String },
        sex: { type: Number },
        phone: { type: String },
        code: { type: String },
        role: { type: String }, //RM  or  CL
        clients: [{
            openid: String,
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
            deleteStatus: { type: Boolean, default: false }
        }],
        group: [],
        token: { type: String },
        expireDate: { type: Number },
        roles: [
            {
                type: String,
                enum: [
                    "chat",
                    "basic", //the basic auth
                    "officer",
                    "admin"],// the dashboard admin
                default: "chat",
            }
        ], // api auth
        fromSouce: {
            type: String,
            enum: [
                "wx",
                "web"]
        },
        deleteStatus: { type: Boolean, default: false },

        //-------Audit field-----------------------

        //create date
        createdAt: { type: Date, default: Date.now },
        //update
        updatedAt: { type: Date, default: Date.now },


    }, {
            versionKey: false,
            timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
            collection: 'user'
        });
    userSchema.plugin(mongoosePaginate);
    return mongoose.model('User', userSchema);
}





