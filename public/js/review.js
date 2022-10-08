/* eslint-disable*/

const addReviewForm = document.querySelector('.form--addReview');

const addReview = async (review, rating, userId, postId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/posts/${postId}/reviews`,
      data: { review, rating, userId },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Add Review successfully!');
      window.setTimeout(() => {
        location.assign(`/post/${postId}`);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (addReviewForm) {
  addReviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const userId = document.getElementById('userId').value;
    const postId = document.getElementById('postId').value;

    addReview(review, rating, userId, postId);
  });
}
