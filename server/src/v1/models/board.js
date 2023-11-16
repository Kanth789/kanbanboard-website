const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {schemOptions} = require('./modelOptions')

const boardSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true

    },
    title:{
        type:String,
        default:'Untitled'
    },
    description:{
        type:String,
        default:'This is default description'
    },
    position:{
        type:Number
    },
    favourite:{
        type:Boolean,
        default:false
    },
    favouritePosition:{
        type:Number,
        default:0
    }
},schemOptions)

module.exports = mongoose.model('Board',boardSchema)