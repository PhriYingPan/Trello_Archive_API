
// HOW TO USE: Input date as "12.9.20" (month. day. year)
import fetch from 'node-fetch';


const APIKey = 'd701cf13acc3ca5992bbc72f8ca8919c';
const APIToken = '3f5b0d199ba0cc33a083c6cc93a97f9442af75a12a2ba8f011148265a437a185';
const shortURL = 'CUxZMcjO'; 



// arguments entered
let regex = '' + process.argv[2];

// throws error if there aren't exactly 3 args
if (+process.argv[3]) {
    throw "Input date as Ex: 12.9.20 (month.day.year)";
} 
let regexArray = regex.split(".");

if (regexArray.length !== 3) {
    throw "Input date as Ex: 12.9.20 (month.day.year)";
}

let firstNumNan = Number(regexArray[0]); // month
let secondNumNan = Number(regexArray[1]); // day
let thirdNumNan = Number(regexArray[2]); // year

let firstNum = regexArray[0]; // month
let secondNum = regexArray[1]; // day
let thirdNum = regexArray[2]; // year


if (firstNum.length === 1 && !isNaN(firstNum)) {
    firstNum = '0' + firstNum;
}
if (secondNum.length === 1 && !isNaN(secondNum)) {
    secondNum = '0' + secondNum;
}
if (thirdNum.length === 1 && !isNaN(thirdNum)) {
    thirdNum = '0' + thirdNum;
}





console.log(firstNum);
console.log(secondNum);
console.log(thirdNum);

if (isNaN(firstNumNan)) {
    firstNum = '';
}
if (isNaN(secondNumNan)) {
    secondNum = '';
}
if (isNaN(thirdNumNan)) {
    thirdNum = '';
}


// Gets all lists in board given the board id
let arrayOfLists = [];  // what fetch returns (list of TrelloLists)
fetch(`https://api.trello.com/1/boards/${shortURL}/lists?key=${APIKey}&token=${APIToken}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})
  .then(response => {
    // console.log(
    //   `Response: ${response.status} ${response.statusText}`
    // );
    return response.text();
  })
  .then(text => {
    // List of TrelloLists
    arrayOfLists = JSON.parse(text);
    let filteredArray = [];

    // Iterate through TrelloLists and filter only if card has a date
    arrayOfLists.forEach(trelloList => {
        if (!isNaN(Number(trelloList.name[0]))) {
            let splitName = trelloList.name.split('.');
            let tempNumOne = splitName[0];
            let tempNumTwo = splitName[1];
            let tempNumThreeInit = splitName[2];
            let threeArray = tempNumThreeInit.split(' ');
            let tempNumThree = threeArray[0];

            // Adds to filteredArray (Contains all TrelloLists to be archived) if it includes all arguments we entered
            if ((tempNumOne.includes(firstNum)) && (tempNumTwo.includes(secondNum)) && (tempNumThree.includes(thirdNum))) {
                filteredArray.push(trelloList)
                console.log(`Archiving: ${trelloList.name}, ${trelloList.id}`);
            }
        }
    });
    
    filteredArray.forEach(trelloList => {
        // archive trelloList.id
        fetch(`https://api.trello.com/1/lists/${trelloList.id}/closed?key=${APIKey}&token=${APIToken}&value=true`, {
            method: 'PUT'
        })
            .then(response => {
                // console.log(
                // `Response: ${response.status} ${response.statusText}`
                // );
                return response.text();
            })
            .then()
            .catch(err => console.error(err));
    });
})
  .catch(err => console.error(err));
