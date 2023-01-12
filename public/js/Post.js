/* eslint-disable*/

const createPostForm = document.querySelector('.form--createPost');
const editPostForm = document.querySelector('.form--editPost');
const deletePostBtn = document.getElementById('delete-post');

const createPost = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/posts',
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Create Post successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const editPost = async (data, postId) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/posts/${postId}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Edit Post successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const deletePost = async (postId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/posts/${postId}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Delete Post successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (createPostForm) {
  createPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append('title', document.getElementById('title').value);
    form.append('description', document.getElementById('description').value);
    form.append('price', document.getElementById('price').value);
    form.append('imageCover', document.getElementById('imageCover').files[0]);
    Array.from(document.getElementById('images').files).forEach((file) => {
      form.append('images', file);
      console.log(file);
    });

    createPost(form);
  });
}

if (editPostForm) {
  editPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();

    form.append('title', document.getElementById('title').value);
    form.append('description', document.getElementById('description').value);
    form.append('price', document.getElementById('price').value);
    form.append('imageCover', document.getElementById('imageCover').files[0]);
    Array.from(document.getElementById('images').files).forEach((file) => {
      form.append('images', file);
      console.log(file);
    });
    const postId = document.getElementById('postId').value;

    editPost(form, postId);
  });
}

if (deletePostBtn) {
  deletePostBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const { postId } = e.target.dataset;

    deletePost(postId);
  });
}
