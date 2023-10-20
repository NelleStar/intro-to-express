const express = require("express");
const ExpressError = require("./expressError");

const app = express();

app.use(express.json());

// homepage
app.get('/', (req, res, next) => {
    return res.send("THIS IS THE HOMEPAGE")
})

// mean
app.get("/mean", (req, res, next) => {
    try {
        const numbers = req.query.numbers.split(',').map(Number);
        let sum = 0;
        let mean;

        if (numbers.some(isNaN)) {
          throw new ExpressError("Please enter valid numbers seperated by a comma", 400);
        }
        numbers.forEach((num) => {
            sum += num;
        });
        mean = sum / numbers.length;

        return res.send(`The mean of ${numbers} is ${mean}`)
    } catch(e) {
        next(e)
    }
})

// median
app.get("/median", (req, res, next) => {
    try {
        const numbers = req.query.numbers.split(',').map(Number);
        let median;

        if (numbers.some(isNaN)) {
            throw new ExpressError("Please enter valid numbers seperated by a comma", 400);
        }

        numbers.sort((a,b) => a-b);
        if (numbers.length % 2 === 0) {
            const middle = numbers.length/2;
            median = (numbers[middle-1] + numbers[middle]/2);
        } else {
            median = numbers[Math.floor(numbers.length/2)];
        }  
        
        return res.send(`The median of ${numbers} is ${median}`)
   
    } catch(e) {
        next(e)
    }
})

// mode
app.get("/mode", (req, res, next) => {
  try {
    const numbers = req.query.numbers.split(",").map(Number);
    let median;

    if (numbers.some(isNaN)) {
      throw new ExpressError(
        "Please enter valid numbers separated by a comma",
        400
      );
    }

    let maxCount = 0;
    let values = [];
    let counts = {};

    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      counts[num] = (counts[num] || 0) + 1;

      if (counts[num] > maxCount) {
        maxCount = counts[num];
        values = [num];
      } else if (counts[num] === maxCount && !values.includes(num)) {
        values.push(num);
      }
    }

    return res.send(`The mode(s) of ${numbers} is/are ${values.join(", ")}`);
  } catch (e) {
    next(e);
  }
});


app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

app.use(function (err, req, res, next) {
  let status = err.status || 500;
  let message = err.msg;

  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});