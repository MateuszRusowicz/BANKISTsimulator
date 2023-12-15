'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// -------------------- Data Accounts------------------------//

const account1 = {
  owner: 'Jan Szczerba',
  username: 'js',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  balance: '',
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2023-12-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const account2 = {
  owner: 'Jessica Dain',
  username: 'jd',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  balance: '',
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Stephan Tom Wonka',
  username: 'stw',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  balance: '',
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-GB',
};

const account4 = {
  owner: 'Samantha Smith',
  username: 'ss',
  movements: [430, 1000, 700, 50, 90],
  balance: '',
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const accounts = [account1, account2, account3, account4];

//---------------- Elements HTML-------------------------//
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////////////////////////////////////////
//////////////////*****THE APP***///////////////////////////////
///////////////////////////////////////////////////////////////
//----------------introductory functions--------------------//

//Date of Operation
const formatMovDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDaysPassed(new Date(), date);
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//format of currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//Displays new operation in the stack
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ' ';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; //sorts a shallow copy of the movements

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //get date of the operations
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovDate(date, acc.locale);

    //displaying html movements object
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1 + ' ' + type
    }</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Displayes balance
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acum, mov) => acum + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

//Displays In/Out/Interest at the bottom of the page
const displaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(int => (int * acc.interestRate) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//display UI (balance, summary and movements)
const displayUI = function (acc) {
  displayBalance(acc);
  displayMovements(acc);
  displaySummary(acc);
};

/////////////////////////////////////////////////////////////////
///////////////------EVENT HANDLERS-----------///////////////////
////////////////////////////////////////////////////////////////

///////////----------LOGIN PROCEDURE---------//////////////
let currentAccount;
let timer;

//Timer
const startLogOutTimer = function () {
  let time = 120;
  const tick = function () {
    const min = Math.trunc(time / 60);
    const sec = time % 60;
    labelTimer.textContent = `${min}:${sec}`;

    //timeout condition
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--; //decreases timer every second
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Login

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    displayUI(currentAccount);

    //Displaying Current Date
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    //start the timer & check for other timers
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//////////---------TRANSFERS------------/////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  if (
    amount > 0 && //cannot transfer negative
    currentAccount.balance >= amount && //does donor have enough money?
    receiver && //does the receiver exist?
    receiver.username !== currentAccount.username //are you not transfering to yourself?
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
  }
  // Add Transfer Date
  currentAccount.movementsDates.push(new Date().toISOString());
  receiver.movementsDates.push(new Date().toISOString());

  //clearing the data
  inputTransferAmount.value = inputTransferTo.value = '';
  displayUI(currentAccount);

  //start the timer & check for other timers
  clearInterval(timer);
  timer = startLogOutTimer();
});

////////----------Requestiong Loan--------------////////////

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value); //only grants a loan when there is at least one deposit with at least 10% of the loan
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    inputLoanAmount.value = '';
    setTimeout(function () {
      currentAccount.movements.push(amount);
      inputLoanAmount.value = '';

      //add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      displayUI(currentAccount);
    }, 2500);

    //start the timer & check for other timers
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

////////////-----------------Deleting the Account------------//////////

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    Number(inputClosePin.value) === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    console.log(accounts);
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

//////////////////--------------------SORTING--------------------////////////

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
