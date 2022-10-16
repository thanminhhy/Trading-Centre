/* eslint-disable*/

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

const getReviewsState = async (postId) => {
  let ctx = document.getElementById('myChart');
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

    if (res.data.data.fiveStar.length > 0)
      fiveStar = res.data.data.fiveStar[0].num;
    if (res.data.data.fourStar.length > 0)
      fourStar = res.data.data.fourStar[0].num;
    if (res.data.data.threeStar.length > 0)
      threeStar = res.data.data.threeStar[0].num;
    if (res.data.data.twoStar.length > 0)
      twoStar = res.data.data.twoStar[0].num;
    if (res.data.data.oneStar.length > 0)
      oneStar = res.data.data.oneStar[0].num;

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

getReviewsState('63273ac4f8284b49f4f57f99');

const getSalesMonthly = async (postId) => {
  let ctx = document.getElementById('myChart2');
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

getSalesMonthly('63273ac4f8284b49f4f57f99');
