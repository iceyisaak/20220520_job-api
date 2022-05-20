const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError('Incorrect username or password.');
  }

  // DEMO ID
  const id = new Date().getDate();

  // DEMO ONLY
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.status(200).json({ msg: 'User Created', token });
};


const dashboard = async (req, res) => {

  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({ msg: `Hi, ${req.user.username}`, secret: `Here is your authorised data. Your lucky number is ${luckyNumber}` });



};

module.exports = {
  login,
  dashboard
};