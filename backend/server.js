const express = require('express')
const mongoose = require('mongoose')
const Pusher = require("pusher");
const app = express()
const cors = require('cors')
const port= process.env.PORT || 3001

app.use(express.json())
app.use(cors())
const messagesRouter = require('./controllers/messages')


const pusher = new Pusher({
    appId: "1426241",
    key: "a71c2a5658b701ee38fc",
    secret: "3c909910176b659acdc3",
    cluster: "ap2",
    useTLS: true
  });

const connection_url = 'mongodb+srv://admin:LAZWIpVF57CO3DjA@cluster0.zey54oo.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url)

const db = mongoose.connection
db.once('open', () => {
    console.log("DB connected")

    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch()

    changeStream.on('change', (change) => {
        console.log("Change Occured",change)

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        }else{
            console.log('Error triggering Pusher')
        }
     })
})


  
app.use('/api/messages', messagesRouter)
app.get('/', (req,res) => res.status(200).send("HELLO"))

app.listen(port, () => console.log(`Listening to port ${port}`))