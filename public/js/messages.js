/* eslint-disable*/
const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const searchForm = document.getElementById('search-user');

const socket = io();

$(document).ready(function () {
  $('#action_menu_btn').click(function () {
    $('.action_menu').toggle();
  });
});

//Message from server
socket.on('message', (message, user) => {
  outputMessage(message, user);
  // document.location.reload(true);
  // //Scroll down

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//search User
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = e.target.elements.search.value.toLocaleLowerCase();

    const receivers = document.querySelectorAll('.receiver');

    for (var i = 0; i < receivers.length; i++) {
      const receiver = receivers[i].textContent.toLocaleLowerCase();
      if (receiver.includes(value)) {
        receivers[i].style.display = '';
      } else {
        receivers[i].style.display = 'none';
      }
    }
  });
}

// Message submit
if (chatForm)
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
function outputMessage(message, user) {
  const div = document.createElement('div');

  div.classList.add('message');

  div.innerHTML = `
  <p class="meta">
  <span>${message.username}</span> 
  <span> | </span> 
  <span>${message.time}</span>
  </p>
  <p class="text">
    <img class="rounded-circle user_img_msg" src="../img/users/${user.photo}">
    <span>${message.text}</span>
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
