
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const mongoosePaginate = require('mongoose-paginate');
    var sysUserSchema = new mongoose.Schema({
        //user email
        email: { type: String },
        username: { type: String },
        password: { type: String },
        //user head image
        avator: { type: String },
        nickname: { type: String },
        phone: { type: String },
        code: { type: String },
        clients: [],
        token: { type: String },
        roles: [
            {
                type: String,
                enum: [
                    "basic", //the basic auth
                    "officer",
                    "admin"] // the dashboard admin
            }
        ], // api auth

        status: {
            type: String,
            enum: [
                "0", // disable 
                "1", // invite
                "2", // active
                "3"  // disable and invite

            ]
        }, //RM  or  CL

        //-------Audit field-----------------------

        //create date
        createdAt: { type: Date, default: Date.now },
        //update
        updatedAt: { type: Date, default: Date.now },

    }, {
            versionKey: false,
            timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
            collection: 'sys_user'
        });
    sysUserSchema.plugin(mongoosePaginate);
    return mongoose.model('sysUser', sysUserSchema);
    
}


