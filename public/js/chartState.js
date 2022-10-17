/* eslint-disable*/

const stateForm = document.querySelector('.form--state');

if (stateForm) {
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  function months(config) {
    var cfg = config || {};
    var count = cfg.count || 12;
    var values = [];
    var i, value;
    for (i = 0; i < Math.floor(count); ++i) {
      value = MONTHS[i];
      values.push(value);
    }

    return values;
  }

  const postId = document.getElementById('postId').value;

  const getReviewsState = async (postId) => {
    let ctx = document.getElementById('reviewChart');
    let labels = ['☆☆☆☆☆', '☆☆☆☆', '☆☆☆', '☆☆', '☆'];
    let colorHex = ['#FB3640', '#EfCA08', '#43AA8B', '#253D5B', '#E51BB1'];
    let fiveStar = 0;
    let fourStar = 0;
    let threeStar = 0;
    let twoStar = 0;
    let oneStar = 0;
    try {
      const res = await axios({
        method: 'GET',
        url: `/api/reviews/reviewsState/${postId}`,
      });

      res.data.data.forEach((el) => {
        if (el.rating === 1) oneStar = el.amount;
        if (el.rating === 2) twoStar = el.amount;
        if (el.rating === 3) threeStar = el.amount;
        if (el.rating === 4) fourStar = el.amount;
        if (el.rating === 5) fiveStar = el.amount;
      });

      let myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [
            {
              data: [fiveStar, fourStar, threeStar, twoStar, oneStar],
              backgroundColor: colorHex,
            },
          ],
          labels: labels,
        },
        options: { responsive: true },
      });
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };

  getReviewsState(postId);

  const getSalesMonthly = async (postId) => {
    let ctx = document.getElementById('saleChart');
    let labels = months();
    let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    try {
      const res = await axios({
        method: 'GET',
        url: `/api/purchase/getSalesMonthly/${postId}`,
      });

      res.data.data.forEach((el) => {
        data[el.Month - 1] = el.sale;
      });

      let myChart2 = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              label: 'Monthly Sale',
              data,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
          labels: labels,
        },
        options: { responsive: true },
      });
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };

  getSalesMonthly(postId);
}
