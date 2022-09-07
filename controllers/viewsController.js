exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up your account',
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'Home Page',
  });
};
