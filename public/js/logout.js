/* eslint-disable*/

const logOutBtn = document.querySelector('.nav__el--logout');

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/users/logout',
    });

    if ((res.data.status = 'success')) {
      showAlert('success', 'Logout Successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again');
  }
};

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
