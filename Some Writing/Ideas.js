const fixedDecimalPoint = (num, decimal) => {
  if (num.split(".")[1] || num.split(".")[1].length <= decimal) {
    let parsedFloat = parseFloat(num);
    return isNaN(parsedFloat) ? 0 : parsedFloat;
  }
};

//Reducer and Array.reduce
// console.log(
//   [0, 1, 2, 3, 4, 5, 6, 7].reduce(function(
//     accumulator,
//     currentValue,
//     currentIndex,
//     array
//   ) {
//     console.log(
//       "accumulator, currentValue, currentIndex, array: ",
//       accumulator,
//       currentValue,
//       currentIndex,
//       array
//     );
//     return accumulator + currentValue;
//   })
// );

//Default parameters for first argument in a function with more than one argument
function funct(state = { abc: "ab" }, value) {
  console.log("state ", state);
  console.log("value ", value);
}

funct({ zyx: "zyx", a: 1 }, 112);
funct(null, 1125);

// Concept learned.
/*
DOMSnap : 
  Storing the DOM elements into the window.cache 
*/