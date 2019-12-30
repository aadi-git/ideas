//A function which checks if duplicate entries are there, Very slow, 115% slower than Array.reduce method
// function recursiveArrayDuplicate(array, number) {
//   if (array.length !== 0 && array.includes(number)) {
//     let count = 1;
//     let numberIndex = array.indexOf(number);
//     count += recursiveArrayDuplicate(
//       array.slice(numberIndex !== -1 ? numberIndex + 1 : array.length),
//       number
//     );
//     return count;
//   }
//   return 0;
// }

console.time();
var arrayNew1 = [];
while (arrayNew1.length < 10000) {
  arrayNew1.push("");
}
arrayNew1 = arrayNew1.map(() => parseInt(Math.random() * 10000));
console.timeEnd();

console.time();
/*A function to find remove duplicates, Very fast takes approax. 10ms for 1000 elements in worst case, 
150ms for 10000 elements*/
//Which is also a way to create N unsorted numbers
var arrayWithDuplicateReduced = arrayNew1.reduce((newArray, element) => {
  newArray = newArray.includes(element) ? newArray : [...newArray, element];
  return newArray;
}, []);

/*From above experiment it is seen that using Math.Random when we create 1000 elements which are under 
1000, the possibility of duplicate numbers is 35%*/

console.timeEnd();
console.log("arrayWithDuplicateReduced: ", arrayWithDuplicateReduced);

// console.time();
// let arrayWithDuplicateRecursion = arrayNew1.filter(
//   ele => recursiveArrayDuplicate(arrayNew1, ele) > 1
// );

// console.timeEnd();
// console.log("arrayWithDuplicateRecursion: ", arrayWithDuplicateRecursion);

//To give load to javascript compiler as two random numbers match very rarely.
// while (arrayNew1.length !== 2) {
//   if (arrayNew1.length === 0) {
//     arrayNew1.push(Math.random());
//   } else {
//     let rand = Math.random();
//     if (arrayNew1.includes(rand)) arrayNew1[1] = rand;
//   }
// }
