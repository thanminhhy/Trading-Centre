/* eslint-disable*/

const signUpForm = document.querySelector('.form--signup');

const signUp = async (
  email,
  name,
  dateOfBirth,
  city,
  address,
  phoneNumber,
  gender,
  password,
  passwordConfirm
) => {
  console.log(
    email,
    name,
    dateOfBirth,
    city,
    address,
    phoneNumber,
    gender,
    password,
    passwordConfirm
  );
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/users/signup',
      data: {
        email,
        name,
        dateOfBirth,
        city,
        address,
        phoneNumber,
        gender,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Please check your email to verify account!');
      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const city = document.getElementById('city').value;
    const address = document.getElementById('address').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const gender = document.getElementById('gender').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signUp(
      email,
      name,
      dateOfBirth,
      city,
      address,
      phoneNumber,
      gender,
      password,
      passwordConfirm
    );
  });
}
