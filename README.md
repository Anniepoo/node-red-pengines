# node-red-pengines

This is a palette module for IBM's flow language node-red that allows querying a SWI-Prolog pengines server.

## Why would I want to?

Quite often in the world of IoT, devices, and online connections that are common to node-red, you may need to do some reasoning about what to do next. If so, Prolog is a great way to do the reasoning.

SWI-prolog has a facility, **pengines**, that allows one to submit a prolog query to a running instance of SWI-Prolog
and obtain a sequence of answers.

## What You need to know to use _node-red-pengines_ ?

You do *not* need to be an expert in Prolog. The section below should teach you enough to make basic Pengines queries.

You do need to know node-red, obviously.

##Installation

You will need a working install of node-red, obviously.

Install the node.js pengines client

    cd ~/.node-red/
    npm install pengines

Now you need to make the pengines module available to the pengines node. Edit ~/.node-red/settings.js

Find this section

    functionGlobalContext: {
        // os:require('os'),
        // jfive:require("johnny-five"),
        // j5board:require("johnny-five").Board({repl:false})
        penginesModule:require('pengines')   // add this line
    },

and add the line penginesModule:require('pengines')

Now restart node-red and add the node-red pengines palette module from the UI:  _menu->manage palette_ search for pengines, and install.


## Understanding node-red-pengines

node-red-penginges is a thin wrapper around [https://npm.runkit.com/pengines](the npm pengines package). This in turn is a client for [http://pengines.swi-prolog.org/docs/index.html](Pengines), and so use requires knowledge of the Pengines system, although only minimal understanding of pengines or of Prolog is sufficient to make basic queries.

This palette module supplies a single node type, pengine-rpc. It expects messages whose payload is a valid prolog query, and returns messages that are the answers to that query.

One of the significant advantages of a pengine is the ability to persist information on the server in the short term. If you wish to use this facility, make a local pengine on the server, obtain the ID, and then use pengine-rpc to make the local pengine query.

## Node Settings 

Stuff about the server, chunking, etc.

## Don't Know Prolog

If you don't know Prolog, you can do most basic queries with this introduction.

### Atoms and Variables

Prolog is case sensitive. Variables start with an uppercase letter, so `ThisIsAVariable`. All other identifiers are atoms, which either start
with a lowercase letter, and consist of letters, numbers, and underscore: `this_is_an_atom`, or are enclosed in single quotes: `'!Wow, also an atom!'`.  `'taxes'` and `taxes` are the same atom - the single quotes are optional here.

### Queries

Most pengines queries are simply a call to a single predicate (sort of like a function in Prolog). 

---
    employee_info('Bob Smith', Position, Salary)
---

The results will *bind* Position and Salary to whatever's appropriate for Bob.  This means we can ask strange questions like
who has a salary of 85000.

---
    employee_info(Name, Position, 85000)
---

It's up to the implementer on the Prolog side which of of these 'modes' are actually implemented. You'll need to check with the documentation of the Prolog code. A commonly used convention in the Prolog community is to write a + meaning the argument must be supplied, a - to mean the predicate will fill it in, and ? to mean either is acceptable.  So, we can probably ask for any combination of arguments for employee_info. This would be documented as employee_info(?, ?, ?).


### Underscore

We really didn't ask for the position, we just wanted the name. So we can put an underscore in the second argument to say we're not interested in it.

---
    employee_info(Name, _, 85000)
---

### Strings

Notice that Bob's name is an atom.  Prolog also has "real strings", and "codes strings". All get converted to js Strings.

### Nondeterminism

Now, if we happen to have two Bob Smiths in the company?  We'll get two messages. If there is no Bob Smith, we'll get no data. So Queries always return an iterator.

One tricky bit about this.  Prolog returns all the ways it can 'prove' the employee info is true. This sometimes means it will return multiple copies of a single answer. If you need rows to be distinct, work with the Prolog programmer.

### Limiting answers

I said above that most queries are a single predicate. An exception to that is that you might want to limit your query to a range. Here's how to do it.

---
    (employee_info(Name, _, Salary), Salary > 85000, Salary =< 120000)
---

The commas mean 'and' in this context. You can use another predicate as well. Say you have `department(Name, Department)` and want to find salaries of employees in marketing, similar to an SQL join.

---
    (employee_info(Name, _, Salary), department(Name, marketing))
---

Notice, as an aside, that marketing is an atom. 

## Contributors

If you make a PR, please add your name and/or update contribs

   * Anne Ogborn (Anniepoo on github) - original code
   * brianx - much advice, alpha testing.
 



