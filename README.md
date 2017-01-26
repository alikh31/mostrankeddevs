# Most ranked devs

[![Build Status](https://travis-ci.org/alikh31/mostrankeddevs.svg?branch=master)](https://travis-ci.org/alikh31/mostrankeddevs) [![Coverage Status](https://coveralls.io/repos/github/alikh31/mostrankeddevs/badge.svg?branch=master)](https://coveralls.io/github/alikh31/mostrankeddevs?branch=master)

This is an CLI tool to get the github users with most stars repos per city.

## Installation

``` bash
git clone https://github.com/alikh31/mostrankeddevs.git
cd mostrankeddevs
npm i
```

## How it works

The application gets the target city to search the developer from command line arguments, then it makes a call to git hub api to extract names of the developer in that city.

For this api call since it would be high cost and not efficient to query all the developers in a city it proceed to the next step by picking up first 100 developer in that city ordered by the number of their followers (github API does not provide any information about number of starts for a user repositories).

Then base on the list extracted in previous step, makes individual calls to github api to extract repositories of each user which are written mainly in **javascript** and calculate the total number of stars for all the repository per user.

At the end it sorts users base on their score and pick the top three and prints the result.

## How to use

Call the application with `-c [CITY]` flag to execute the search, example:

`node mostrankeddevs.js -c berlin`
