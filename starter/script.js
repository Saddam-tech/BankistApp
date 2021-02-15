'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};
const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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

///////////////////////////////////////////////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0); // creating a new property called balance in accounts
  labelBalance.textContent = `${acc.balance}€`;
};

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Sorting EventListener

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Creating usernames

const createUserName = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);

const updateUI = function (acc) {
  // Display movements

  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);
  // Display summary

  calcDisplaySummary(acc);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int);

  labelSumInterest.textContent = `${interest}€`;
};

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  console.log('Delete');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Delete account
    accounts.splice(index, 1);

    //Hide the UI
    containerApp.style.opacity = 0;

    // Display UI and message
    labelWelcome.textContent = `See you again, ${
      currentAccount.owner.split(' ')[0]
    }`;

    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////

// const arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['f', 'g', 'h', 'i', 'j'];

// const letters = arr.concat(arr2);

// console.log(letters.join(' - '));

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
//   if (i === 7) {
//     console.log(`Reached! ${arr}`);
//   } else {
//     console.log('Not reached');
//   }
// });

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// console.log();

// const me = ['Saddam', 'Salokhiddinov', 22, true, 'Here'];

// for (const I of me) {
//   if (typeof I !== 'string') continue;
//   else {
//     console.log(I);
//   }
// }

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//   const copyJulia = dogsJulia.slice(1, -2);
//   const data = [copyJulia, dogsKate];
//   console.log(data);
//   data.forEach(function (datum) {
//     datum.forEach(function (number, index) {
//       if (number >= 3) {
//         console.log(
//           `Dog number ${index + 1} is an adult, and is ${number} years old!`
//         );
//       } else {
//         console.log(`Dog number ${index + 1} is still a puppy`);
//       }
//     });
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// console.log('---CHECKPOINT---');
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

///////////////////////////

// const eurToUSD = 1.1;

// const movementsUSD = movements.map(mov => mov * eurToUSD);

// console.log(movementsUSD);

// const movementsUSDfor = [];

// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUSD);
// }

// console.log(movementsUSDfor);

//

// const deposits = movements.filter(mov => mov > 0);

// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);

// console.log(movements);
// console.log(withdrawals);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// });

// const balance = movements.reduce((acc, cur) => acc + cur);

// const max = movements.reduce((acc, cur) => {
//   if (acc > cur) return acc;
//   else return cur;
// }, movements[0]);

// console.log(max);

//Challenge 2

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(humanAge => humanAge >= 18)
//     .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
// const excludeDog = humanAges.filter(humanAge => humanAge >= 18);
// const calcAverage = excludeDog.reduce(
//   (acc, cur, i, arr) => acc + cur / arr.length,
//   0
// );
// console.log(`humanAges: ${humanAges}`);
// console.log(`excludeDog: ${excludeDog}`);

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const calcAverageHumanAge2 = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adults);

//   // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

//   const average = adults.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   // 2 3. (2+3)/2 = 2.5 === 2/2+3/2 = 2.5

//   return average;
// };
// const avg1 = calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// const apps = [5, 2, 4, 1, 15, 8, 3];

// const filtered = apps.filter(app => app > 5);

// console.log(filtered);

// const eurToUSD = 1.1;

// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUSD)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

// const firstWithdrawal = movements.find(mov => mov < 0);

// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(account);

// Some: condition

// const anyDeposits = movements.some(mov => mov > 0);

// console.log(anyDeposits);

// EVERY

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// const deposit = mov => mov > 0;

// console.log(movements.every(deposit));
// console.log(movements.some(deposit));
// console.log(movements.filter(deposit));

// const overallBalance = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, cur) => acc + cur, 0);

// console.log(overallBalance);

// console.log(movements.sort((a, b) => a - b));

// const arr = new Array(7);
// arr.fill(2, 2, 5);
// console.log(arr);

// const arr2 = Array.from({ length: 100 }, (_, i) => i + 1);
// console.log(arr2);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(`Here we go: ${movementsUI}`);
// });

// const bankDeposit = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, cur) => acc + cur, 0);

// console.log(bankDeposit);

// ///////

// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// console.log(numDeposits1000);

// ////

// const { deposits, withdrawals } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a long title but not too lond'));
// console.log(convertTitleCase('and here is another title with another example'));

//// Coding challenge #4

//TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.

dogs.forEach(
  curDog => (curDog.recPortion = Math.trunc(curDog.weight ** 0.75 * 28))
);
console.log(dogs);

// 2.

const dogSarah = dogs.find(curDog => curDog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recPortion ? 'much' : 'little'
  }`
);
// 3.

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recPortion)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooLittle);

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recPortion)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);

// 4.

console.log(
  `${ownersEatTooLittle}s' dogs eat too little while ${ownersEatTooMuch}s' dogs eat too much`
);

// 5.

const correctEaters = dogs.some(dog => dog.recPortion === dog.curFood);

console.log(correctEaters);

// 6.

const okayAmount = dog =>
  dog.curFood > dog.recPortion * 0.9 && dog.curFood < dog.recPortion * 1.1;

console.log(dogs.some(okayAmount));

// 7.

console.log(dogs.filter(okayAmount));

// 8.

console.log(dogs.flatMap(dog => dog.recPortion).sort((a, b) => a - b));
