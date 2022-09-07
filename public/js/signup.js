/* eslint-disable*/
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  window.setTimeout(hideAlert, 5000);
};

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
      showAlert('success', 'Sign Up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
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
