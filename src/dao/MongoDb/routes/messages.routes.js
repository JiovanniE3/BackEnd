import { Router } from "express";
import __dirname from '../../../utils.js';
import { messageModel } from "../models/messages.model.js";
import { serverSocket } from "../../../app.js";

const router = Router()


router.get('/', async (req, res) => {

    let messages = await messageModel.find();

    res.json(messages);

});

router.post('/', async (req, res) => {

    const {
        user,
        message
    } = req.body;

    try {
        let newMessage = await messageModel.create({
            user,
            message
        })

        await newMessage.save();

        let messages = await messageModel.find();

        serverSocket.emit('newMessage', newMessage, messages);

        res.status(201).json({ message: 'message send', User: user, Text: message });

    } catch (error) {
        res.status(500).json({ error: 'unexpected error', detail: error.message })
    }

});

router.delete('/', async (req, res) => {

    let deleteChat = await messageModel.deleteMany({})

    res.status(201).json({ message: 'chat deleted'});

    let messages = await messageModel.find();

    serverSocket.emit('cleanMessage', messages);

});

export default router;
