const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const blogSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        minLength: 5
    },
    content:{
        type: String,
        required: true,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps: true})
blogSchema.plugin(mongoosePaginate)
const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog