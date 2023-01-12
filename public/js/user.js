/* eslint-disable*/

const editUserForm = document.querySelector('.form--editUser');
const deleteUserBtn = document.querySelectorAll('.delete-user');

const deleteUser = async (userId) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/users/${userId}`,
    });

    if (res.status === 204) {
      showAlert('success', `Delete User successfully!`);
      window.setTimeout(() => {
        location.assign('/allUsers');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
};

const editUser = async (
  name,
  email,
  phoneNumber,
  address,
  city,
  gender,
  status,
  role,
  userId
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/users/${userId}`,
      data: {
        name,
        email,
        phoneNumber,
        address,
        city,
        gender,
        status,
        role,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `Edit User successfully!`);
      window.setTimeout(() => {
        location.assign('/allUsers');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    console.log(err);
  }
};

if (editUserForm) {
  editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const gender = document.getElementById('gender').value;
    const status = document.getElementById('status').value;
    const role = document.getElementById('role').value;

    const userId = document.getElementById('userId').value;

    editUser(
      name,
      email,
      phoneNumber,
      address,
      city,
      gender,
      status,
      role,
      userId
    );
  });
}

if (deleteUserBtn) {
  deleteUserBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const { userId } = e.target.dataset;

      deleteUser(userId);
    });
  });
}
