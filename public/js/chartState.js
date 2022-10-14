/* eslint-disable*/

let ctx = document.getElementById('myChart');
let labels = ['Pizza', 'Taco', 'Hotdog', 'Sushi'];
let colorHex = ['#FB3640', '#EfCA08', '#43AA8B', '#253D5B'];

let myChart = new Chart(ctx, {
  type: 'pie',
  data: {
    datasets: [
      {
        data: [30, 10, 40, 20],
        backgroundColor: colorHex,
      },
    ],
    labels: labels,
  },
  options: { responsive: true },
});
