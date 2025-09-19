const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name '],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true,'please provide emails '],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please provide valid email',
        ],
        unique: true,
    },
    password:{
        type:String,
        required:[true,'please provide password '],
        minlength:6,
    },
})

UserSchema.pre('save', async function(){ ///???
 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    // next()
})

UserSchema.methods.createJWT = function() {
    return jwt.sign(
        {userId:this._id,name:this.name}
        ,process.env.JWT_SECRET
        , {expiresIn:process.env.JWT_LIFETIME,})
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

// UserSchema.method.getName = function(){ //?? understand it in detail later the working
//     return this.name
// }

module.exports =  mongoose.model('User',UserSchema )