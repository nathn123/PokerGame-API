var Game = require('../models/game');
var gameEngine = require('../gameEngine');

function newGame(req,res)
{
    var defaultState = 
    {
        deck: createCards(),
        gameState: 0
    }
    Game.create(defaultState,function(err,result)
    {
        if(err) console.log(err);
        res.status(201).json(result._id);
        
    });

}

function deckDealCards(req, res)
{
    gameEngine.deal(req.params.id);
    res.status(200).json(true);
}

function shuffleDeck(req,res) 
{
    //get the deck using the id
    Game.findById(req.params.id, function(err, result) {
        if (err) console.log(err);
        //shuffle the deck
        var newDeck = shuffle(result.deck);

        //update the game
        Game.findByIdAndUpdate(req.params.id, {
                $set: {deck: newDeck}
            }, function(err, game) {
                if(err) console.log(err);
                res.status(200).json(true);
        });
    });
}

function shuffle(arrayToShuffle) 
{
//shuffles the deck
    var array = arrayToShuffle;

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function createCards()
{
    var newDeck = [];
    //for each suit
    for (var i = 0; i < 4; i++) {
        var suit = "";
        //set suit
        switch(i){
            case 0:
                suit = "Spades"
            break;
            case 1:
                suit = "Hearts"
            break;
            case 2:
                suit = "Clubs"
            break;
            case 3:
                suit = "Diamonds"
            break;
            //default should be un-reachable
            default:
                suit = "HOW?!"
            break;
        }
        //for each number and face cards
        for (var j = 1; j <=13; j++){
            var card = {
                Suit : suit,
                Value : j  
            };
            newDeck.push(card);
        }
        //add to array
        
    }
    return newDeck;
}

module.exports = 
{
    create : newGame,
    shuffle : shuffleDeck,
    deal : deckDealCards
}