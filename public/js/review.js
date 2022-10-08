/* eslint-disable*/

const addReviewForm = document.querySelector('.form--addReview');
const deleteReviewBtn = document.getElementById('delete-review');

const addReview = async (review, rating, userId, postId) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/posts/${postId}/reviews`,
      data: { review, rating, userId },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Add Review Successfully!');
      window.setTimeout(() => {
        location.assign(`/post/${postId}`);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const deleteReview = async (reviewId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/reviews/${reviewId}`,
    });

    if (res.status === 204) {
      showAlert('success', 'Delete Review successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (deleteReviewBtn) {
  deleteReviewBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { reviewId } = e.target.dataset;

    deleteReview(reviewId);
  });
}

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
