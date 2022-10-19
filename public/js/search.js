/* eslint-disable*/

const searchPostForm = document.getElementById('search-post');

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
