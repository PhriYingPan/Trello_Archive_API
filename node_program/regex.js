
// HOW TO USE: Use regex as input: Ex "08\.x*\.19"
import fetch from 'node-fetch';


const APIKey = 'd701cf13acc3ca5992bbc72f8ca8919c';
const APIToken = '3f5b0d199ba0cc33a083c6cc93a97f9442af75a12a2ba8f011148265a437a185';
const shortURL = 'CUxZMcjO'; 



// arguments entered
let input = '' + process.argv[2];
let regex = new RegExp(input);


// Gets all lists in board given the board id
let arrayOfLists = [];  // what fetch returns (list of TrelloLists)
fetch(`https://api.trello.com/1/boards/${shortURL}/lists?key=${APIKey}&token=${APIToken}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})
  .then(response => {
    return response.text();
  })
  .then(text => {
    // List of TrelloLists
    arrayOfLists = JSON.parse(text);
    let filteredArray = [];

    // Iterate through TrelloLists and filter only if card has a date
    arrayOfLists.forEach(trelloList => {
    
        // Adds to filteredArray (Contains all TrelloLists to be archived) if it includes all arguments we entered
        if (regex.test(trelloList.name)) {
            filteredArray.push(trelloList)
            console.log(`Archiving: ${trelloList.name}, ${trelloList.id}`);
        }
        
    });
    
    filteredArray.forEach(trelloList => {
        // archive trelloList.id
        fetch(`https://api.trello.com/1/lists/${trelloList.id}/closed?key=${APIKey}&token=${APIToken}&value=true`, {
            method: 'PUT'
        })
            .then(response => {
                return response.text();
            })
            .then()
            .catch(err => console.error(err));
    });
})
  .catch(err => console.error(err));
