/* eslint-disable*/
const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');

//Get messageID from url

const socket = io();

//Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  //get message text
  const msg = e.target.elements.msg.value;
  const user = JSON.parse(document.getElementById('user').value);
  const conversationId = document.getElementById('conversationId').value;

  addMessage(conversationId, user._id, msg);

  // Emit message to server
  socket.emit('chatMessage', msg, user);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus;
});

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

const addMessage = async (conversationId, userId, msg) => {
  try {
    await axios({
      method: 'POST',
      url: '/api/message/',
      data: {
        conversationId,
        sender: userId,
        message: msg,
      },
    });
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
