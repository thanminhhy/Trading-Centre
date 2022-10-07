/* eslint-disable*/

const socket = io();

const videoGrid = document.getElementById('video-grid');

const ROOM_ID = document.getElementById('roomId').value;

const myPeer = new Peer();

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

let myVideoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    myPeer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    //allow us to connect with other people and send our current video stream to the user connected
    socket.on('user-connected', (userId) => {
      connectToNewUser(userId, stream);
    });
  });

socket.on('user-disconnected', (userId) => {
  if (peers[userId]) peers[userId].close();
});

myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  //call user with the userId and send our stream to them
  const call = myPeer.call(userId, stream);
  const video = document.createElement('video');

  //listen when other users send back video stream to us
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on('close', () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  //allow us to play video
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}

const muteButton = document.querySelector('#muteButton');
const stopVideo = document.querySelector('#stopVideo');

if (muteButton) {
  muteButton.addEventListener('click', () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      html = `<i class="fas fa-microphone-slash"></i>`;
      muteButton.classList.toggle('background__red');
      muteButton.innerHTML = html;
    } else {
      myVideoStream.getAudioTracks()[0].enabled = true;
      html = `<i class="fas fa-microphone"></i>`;
      muteButton.classList.toggle('background__red');
      muteButton.innerHTML = html;
    }
  });
}

if (stopVideo) {
  stopVideo.addEventListener('click', () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      html = `<i class="fas fa-video-slash"></i>`;
      stopVideo.classList.toggle('background__red');
      stopVideo.innerHTML = html;
    } else {
      myVideoStream.getVideoTracks()[0].enabled = true;
      html = `<i class="fas fa-video"></i>`;
      stopVideo.classList.toggle('background__red');
      stopVideo.innerHTML = html;
    }
  });
}
