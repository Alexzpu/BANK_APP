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



// MOVEMENTS
const dispalyMovements = function(movements, sort = false) {
    containerMovements.innerHTML = '';

    const movementsSorted = sort
      ? movements.slice().sort((a, b) => 
          a - b) : movements;
    console.log(movementsSorted);
    

    movementsSorted.forEach(function (mov, i) {
      const type = mov > 0 ? "deposit" : "withdrawal";

      const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${type}</div>
          <div class="movements__date">${i + 1} ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>`;

      containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};




//////////
const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
        return acc + cur
    }, 0);
    labelBalance.textContent = `${acc.balance} EUR`;
};


///////////
const calcDispalySummary = function(acc) {
    const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0) ;
    labelSumIn.textContent = `${incomes} EUR`;

    const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${Math.abs(out)} EUR`;

    const interest = acc.movements.filter(mov => mov > 0).map(deposit => deposit * acc.interestRate / 100).filter((int, i, arr) => {
    return int >= 1 }).reduce((acc, mov) => acc + mov, 0);
    labelSumInterest.textContent = `${interest} EUR`
};
 

/////////
const createUserNames = function(accs) {
    accs.forEach(function(acc) {
        acc.username = acc.owner.toLowerCase().split(' ').map(function(ltr) {
            return ltr[0];
            }).join('');
    });
};
createUserNames(accounts);

///


const updateUI = function(acc){
  
  dispalyMovements(acc.movements);
  calcDisplayBalance(acc)
  calcDispalySummary(acc);
}

//////// LOGIN
let currentAcc;

btnLogin.addEventListener('click', function(e) {
    e.preventDefault();
    currentAcc = accounts.find(function(acc) {
        return acc.username === inputLoginUsername.value
    });
    inputTransferAmount.value = inputTransferTo.value = '';

    if(currentAcc?.pin === Number(inputLoginPin.value)) {
        labelWelcome.textContent = `Welcome back, ${currentAcc.owner.split(' ')[0]}`
        inputLoginUsername.value = '';
        inputLoginPin.value = '';
        inputLoginPin.blur();
        containerApp.style.opacity = 100;
        updateUI(currentAcc)
        inputCloseUsername.value = inputClosePin.value = "";
    };
    
    
});


///

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, reciverAcc);
  if(amount > 0 && reciverAcc && currentAcc.balance >= amount && reciverAcc?.username !== currentAcc.username) {
    currentAcc.movements.push(-amount)
    reciverAcc.movements.push(amount)
    console.log('hello motherfucker');
    updateUI(currentAcc);
  };
});


////
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value)
  if(amount > 0 && currentAcc.movements.some(mov => mov >= amount * 1.0)){
    currentAcc.movements.push(amount);
    updateUI(currentAcc);
    inputLoanAmount.value = '';
    console.log('lol ');
  }
})


btnClose.addEventListener('click', function(e) {
   e.preventDefault();
   if (
     inputCloseUsername.value === currentAcc.username &&
     Number(inputClosePin.value) === currentAcc.pin
   ) {
    const index = accounts.findIndex(acc => acc.username === currentAcc.username)
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
   };
});


let sorted = false;

btnSort.addEventListener("click", function(e) {
  e.preventDefault;
  dispalyMovements(currentAcc.movements, !sorted);
  sorted = !sorted; 
});




// const firstElOfName = username.map(function(ltr) {
//     return ltr[0];
// });

// const userNameLogin = firstElOfName.join('');
// console.log(userNameLogin);


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// const euroToUsd = 1.1;

// const convert = movements.map((mov, i)=> {
//     if(mov > 0){
//         return `Movement ${i + 1}: You deposited ${mov}`
//     }else {
//         return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`
//     }
// });

// console.log(...convert);
// convert.forEach(function(i) {
//     console.log(i);
// });

// const deposits = movements.filter(function(mov) {
//     return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const balance = movements.reduce(function(acc, cur, i, arr) {
//     console.log(`iter num ${i}: ${acc} + ${cur} = ${cur + acc}`);
//     return acc + cur;
// }, 0);

// console.log(balance);

// let bal = 0;
// for (const mov of movements) bal += mov 

// console.log(bal);



// // max value 
// const checkMax = movements.reduce((acc, cur) => {
//     if (acc > cur) {
//         return acc
//     }else {
//         return cur
//     };
// }, movements[0]);

// console.log(checkMax);


// // CHALLENGES

// const julia = [3, 5, 3, 12, 7];
// const kate = [4, 1, 15, 8, 3];
// const julia2 = [3, 5, 3, 12, 7];
// const kate2 = [4, 1, 15, 8, 3];

// const newArr = [];

// const checkDogs = function(dogsJulia, dogsKate) {
//     const juliaCorrcting = dogsJulia.slice(1, -2)
//     const arrOfDofs = juliaCorrcting.concat(dogsKate)

//     arrOfDofs.forEach(function(dog, i) {
//         if (dog >= 3) {
//             console.log(`Dog number ${i +1} is an adult, and is ${dog} y.o`);
//             newArr.push(dog)
//         }else {
//             console.log(`Dog number ${i +1} is a puppy, and is ${dog} y.o`);
//             newArr.push(dog)
//         };
//     });
// };

// checkDogs(julia, kate);

// // dogs age to human age
// const toHumanAge = function(dogAge) {
//     const arrOfDogsAge = dogAge.map(function(dog, i) {
//         if(dog <= 2) {
//             return 2 * dog;
//         }else {
//             return 16 + dog * 4;
//         };
//     });
//     const isMoreThanEighteen = arrOfDogsAge.filter(function(age) {
//         return age >= 18;
//     });
//     const averenge = function (arr) {
//         const sumOfAge = arr.reduce(function(acc ,cur) {
//             return acc + cur;
//         });
//         return sumOfAge / arr.length
//     };
//     isMoreThanEighteen.forEach(function (el, i) {
//         console.log(`the dog number ${i + 1} is ${el} in human age`);
//     })
// };

// toHumanAge(newArr);



// const eurToUsd = 1.1;
// const totalDepositsUSD = movements.filter(function(mov, i, arr) {
//     console.log(mov + '___'); 
//     return mov > 0;
// }).map(function(mov, i, arr) {
//     console.log(mov + '---' + arr + '!!!!'); 
//     return mov * eurToUsd;
// }).reduce(function(acc, mov) {
//     console.log( `${acc} --- ${acc + mov, 0} --- ${mov}` );
//     return acc + mov, 0
// });

// console.log(totalDepositsUSD);



// // FIND METHOD

// const finding = movements.find(mov => mov < 0);
// console.log(finding);
// console.log(accounts);

// const accountJessika = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(accountJessika);

// console.log(movements.includes(-130));

// const anyDeposits = movements.some(mov => mov > 5000);
// console.log(anyDeposits );

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// const deposit = mov => mov > 0;
// console.log(movements.every(deposit));
// console.log(movements.some(deposit));
// console.log(movements.filter(deposit));

// const arrs = [[1,2,3], [4,5,6], 7,8, 9];
// console.log(arrs.flat());

// let accsJoined;
// const arrOfAccs = accounts.map((acc) => acc.movements);
// const sumOfArr = arrOfAccs.flat();
// const sum = sumOfArr.reduce((a, b) => a + b, 0);
// console.log(sum);


// const owners = ['alex', 'monika', 'yaroslava', 'bob'];
// console.log(owners.sort());

// const numbers = [1, 5, 0, 3, 10, 33];
// console.log(numbers.sort());

// movements.sort((a, b) => {
//   if(a>b) {
//     return 1;
//   };
//   if(a<b) {
//     return -1;
//   };
// });

// movements.sort((a, b) => {
//   a - b;
// });



// console.log(movements );



// const arr = [1,2,3,4,5,6,7]

// const x = new Array(7)
// console.log(x);

// // x.fill(1, 3)
// console.log(x);
// // console.log(arr);
// // arr.fill(23, 4, 7);
// console.log(arr);


// //array.from
// // Array.from({length: 7}, (i) => i++);

// // const z = Array.from({length: 100}, (_, i) => Math.floor(Math.random() * 100)+ 1)
// // console.log(z);




// // labelBalance.addEventListener('click', function() {
// //   const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el));
// //   console.log(movementsUI);
// // })








// // exercises



// // 1
// const sumOfMovments = accounts.map(acc => acc.movements).flat().filter(el => el > 0).reduce((acc, cur) => acc + cur, 0)
// console.log(sumOfMovments);

// // nst numDeposits1000 = accounts.map(acc => acc.movements).flat().filter(mov => mov >= 1000).length
// // console.log(numDeposits1000);

// // 3
// const sums = accounts.flatMap(acc => acc.movements).reduce((sums, cur) => {
//   cur > 0 ? sums.deposits += cur : sums.withdrawals += cur;
//   return sums;
// }, {deposits: 0, withdrawals: 0});
// console.log(sums);

// // 4
// const convertToTitle = function(title) {
//   const expections = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'to', 'up', 'and', 'with', 'not', 'too', 'is'];
//   const titleCase = 
//     title.toLowerCase().split(' ').map(word => expections.includes(word) ? 
//     word : word[0].toUpperCase() + word.slice(1)).join(' ')
//   return titleCase
// };
// console.log(convertToTitle('this is a nice title')); 
// console.log(convertToTitle('this is a LONG tilte but not too long'));
// console.log(convertToTitle('and here is another title with an EXEMPLE')); 

// // const toTitleCase = (phrase) => {
// //   return phrase
// //     .toLowerCase()
// //     .split(' ')
// //     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// //     .join(' ');
// // };

// // let result = toTitleCase('maRy hAd a lIttLe LaMb');
// // console.log(result);


// // CHLLENGE #4
// const dogs = [
//   {
//     weight: 22,
//     curFood: 250,
//     owners: ['Alice', 'Bob'],
//   }, 
//   {
//     weight: 8,
//     curFood: 200,
//     owners: ['Matilda',],
//   },
//   {
//     weight: 13,
//     curFood: 275,
//     owners: ['Sarah', 'John'],
//   },
//   {
//     weight: 32,
//     curFood: 340,
//     owners: ['Michael',],
//   },
// ];

// //1
// const recomendedFood = 
//   dogs.forEach(function(el) {
//     return el.recomendedFood = Math.round(el.weight ** 0.75 * 28);
//   });

// //2
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(`Sarah's dog is eating too ${dogSarah.curFood > dogSarah.recomendedFood ? 'much' : 'little'}`);

// //3
// const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recomendedFood).map(dog => dog.owners).flat();
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recomendedFood).map(dog => dog.owners).flat();
// console.log(ownersEatTooLittle);

// //4
// console.log(`${ownersEatTooMuch.join(" and ") } dogs eat too much`);
// console.log(`${ownersEatTooLittle.join(" and ") } dogs eat too little`);

// //5
// console.log(dogs.some(dog => dog.curFood === dog.recomendedFood));

// //6 
// const checkEatingOkay = 
//   dog => dog.curFood > dog.recomendedFood * 0.9 && dog.curFood < dog.recomendedFood * 1.1

// //7
// console.log(dogs.filter(checkEatingOkay));

// //8 
// const dogsSorted = dogs.slice().sort((a,b) => a.recomendedFood - b.recomendedFood)
// console.log(dogsSorted);
