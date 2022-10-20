/* eslint-disable*/

const searchPostForm = document.getElementById('search-post');
const adminSearchUserForm = document.getElementById('admin-search-user');
const searchOrdersForm = document.getElementById('search-order');

if (searchPostForm) {
  searchPostForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const value = e.target.elements.search.value.toLocaleLowerCase();
    console.log(value);

    const postsHeader = document.querySelectorAll('.card__header');
    const posts = document.querySelectorAll('.card');
    console.log(posts);

    for (var i = 0; i < posts.length; i++) {
      const post = postsHeader[i].textContent.toLocaleLowerCase();

      if (post.includes(value)) {
        posts[i].style.display = '';
      } else {
        posts[i].style.display = 'none';
      }
    }
  });
}

if (adminSearchUserForm) {
  adminSearchUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = e.target.elements.search.value.toLocaleLowerCase();
    console.log(value);

    const users = document.querySelectorAll('.user__Name');
    const userInfos = document.querySelectorAll('.userInfo');
    console.log(users);

    for (var i = 0; i < users.length; i++) {
      const user = users[i].textContent.toLocaleLowerCase();

      if (user.includes(value)) {
        userInfos[i].style.display = '';
      } else {
        userInfos[i].style.display = 'none';
      }
    }
  });
}

if (searchOrdersForm) {
  searchOrdersForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = e.target.elements.search.value.toLocaleLowerCase();
    console.log(value);

    const receiversName = document.querySelectorAll('.receiver__name');
    const orders = document.querySelectorAll('.order__detail');

    for (var i = 0; i < receiversName.length; i++) {
      const receiver = receiversName[i].textContent.toLocaleLowerCase();

      if (receiver.includes(value)) {
        orders[i].style.display = '';
      } else {
        orders[i].style.display = 'none';
      }
    }
  });
}
