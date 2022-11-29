/* eslint-disable*/
const stripe = Stripe(
  'pk_test_51LoQFMDZ1Ex0RgZmPtdOK9cnQZzu2N98g6Dul7pdLntvDeB1TygfJfRGRFwNZLdUokvGKmpZMq2yQ6InzWdpADx000WqefgTpp'
);

const buyBtn = document.getElementById('buy-product');

const buyProduct = async (postId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/purchase/checkout-session/${postId}`);
    //2) Create checkout form +charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);

    if (err.response.status === 401) {
      window.location.assign('/login');
    }
  }
};

if (buyBtn) {
  buyBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { postId } = e.target.dataset;
    buyProduct(postId);
  });
}
