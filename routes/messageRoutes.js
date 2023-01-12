const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();
//Add
router.post('/', messageController.createMessage);

router.get('/:conversationId', messageController.getMessages);

module.exports = router;
