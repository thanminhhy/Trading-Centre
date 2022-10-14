const express = require('express');
const conversationController = require('../controllers/conversationController');

//new Conversation

const router = express.Router();

router.post('/', conversationController.createConversation);

router.get('/:userId', conversationController.getConversation);

module.exports = router;
