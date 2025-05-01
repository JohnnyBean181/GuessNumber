// "MyNumber" is dominently responsible for:
// 1. store the answer of the current game
// 2. store how many lives left for the current game
// 3. store how many guesses has been used
// 4. store the min. and max. number for the current game
// 5. verify if the input text is a qualified number and return a code
export class MyNumber {
    constructor(lives=7, min=1, max=100)
    {
      this.answer;
      this.lives=parseInt(lives);
      this.guessSpent=0;
      this.min=parseInt(min);
      this.max=parseInt(max);
      this.setupAnswer();
    }
    setupAnswer()
    {
      this.answer = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    }

    // verify if 'num' is a qualified number, and return a code
    // which implies different situations.
    verifyNum(num)
    {
      console.log("min: " + this.min + " max: " +
                   this.max + " ans: " + this.answer);
      if (this.notNumber(num)) { // when 'num' is not a number
        return -2;
      } else if (this.outRange(num)) { // when 'num' is outside the range
        return -1;
      } else if (num < this.answer) { // when 'num' is lower than the answer
        this.lives--;
        this.guessSpent++;
        return 1;
      } else if (num > this.answer) { // when 'num' is lower than the answerr than the answer
        this.lives--;
        this.guessSpent++;
        return 2;
      } else if (num == this.answer) { // when 'num' is correct
        this.lives--;
        this.guessSpent++;
        return 3;
      }
    }

    // verify if 'num' is number.
    notNumber(num)
    {
      if (!Number.isInteger(num))
        return true;
      return false;
    }

    // verify if 'num' is outside the range.
    outRange(num)
    {
      if (num>this.max || num<this.min)
        return true;
      return false;
    }
  }