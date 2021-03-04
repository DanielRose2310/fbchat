const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:daniel12345@cluster0.yq7vq.mongodb.net/fbchat', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
mongoose.set('useFindAndModify', false);


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongo connected')

});


module.exports = db;