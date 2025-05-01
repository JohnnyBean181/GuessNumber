import { MyNumber } from './MyNumber.js'

// "MyGame" is responsible for:
// 1. store the global configurations, such as lives, min, or max.
// 2. store the historical win record, such as winCount, totalGuesses.
// 3. store the running status, such as playing.
// 4. maintain the "number" object.
// 5. provide public functions to stop or restart the game.
export class MyGame {
    constructor(number = new MyNumber())
    {
      // when a game is over, it will be set as 'false'.
      this.playing = true;
      // e.g. 1 and 2 stand for lose, 3 stands for win.
      this.resultID = 0;
      // how many games a player has won.
      this.winCount = 0;
      // the total guesses a player used in win games.
      this.totalGuesses = 0;
      // how many lives a game starts with.
      this.lives = 7;
      // the minimum number
      this.min = 1;
      // the maximum number
      this.max = 100;
      this.number = number;
    }

    // stop the game
    stop(resultID)
    {
      this.playing = false;
      this.resultID = resultID;
    }

    // restart the game
    restart()
    {
      this.playing = true;
      this.number = new MyNumber(this.lives, this.min, this.max);
    }
  }