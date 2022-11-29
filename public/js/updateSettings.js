/* eslint-disable*/

const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');

const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password' ? '/api/users/updatePassword' : '/api/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} update successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
};

if (updateDataForm) {
  updateDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    const date = new Date(
      Date.parse(document.getElementById('dateOfBirth').value)
    );
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('dateOfBirth', date);
    form.append('phoneNumber', document.getElementById('phoneNumber').value);
    form.append('city', document.getElementById('city').value);
    form.append('address', document.getElementById('address').value);
    form.append('gender', document.getElementById('gender').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}
if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
