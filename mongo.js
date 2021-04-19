const mongoose = require('mongoose')

module.exports = async () => {
    await mongoose.connect(`mongodb+srv://Prophethor:${process.env.MONGO_PASS}@r2d2.kwnug.mongodb.net/r2d3`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    return mongoose
}