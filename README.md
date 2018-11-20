# node-red-contrib-pengines

This is a palette module for IBM's flow language node-red that allows querying a SWI-Prolog pengines server.

## Why would I want to?

Quite often in the world of IoT, devices, and online connections that are common to node-red, you may need to do some reasoning about what to do next. If so, Prolog is a great way to do the reasoning.

SWI-prolog has a facility, **pengines**, that allows one to submit a prolog query to a running instance of SWI-Prolog
and obtain a sequence of answers.

## What do I need to know?

To use _node-red-pengines_ you do *not* need to be an expert in Prolog. 

Most pengines calls are a single line of Prolog.
The section below should teach you enough to make basic Pengines queries.

You do need to know node-red.

## Installation

You will need a working install of node-red, obviously.

You should be able to install from the node-red palette manager.

To manually the package:

    cd ~/.node-red/       (cd c:\Users\<userame>\.node-red\ on windows)
    npm install node-red-contrib-pengines

To install the package from a local git repo:

    cd ~/.node-red/       (cd c:\Users\<userame>\.node-red\ on windows)
    npm install ~/node-red-pengines (or wherever you have it cloned)

## Understanding node-red-pengines

node-red-penginges is a thin wrapper around (the npm pengines package)[https://npm.runkit.com/pengines]. 
This in turn is a client for (Pengines)[http://pengines.swi-prolog.org/docs/index.html], and so 
use requires knowledge of the Pengines system, although only minimal understanding of pengines 
or of Prolog is sufficient to make basic queries.

This palette module supplies a single node type, pengine-rpc. It expects messages whose payload 
is a valid prolog query, and returns messages that are the answers to that query.

## Node Settings 

### Server 

Typically this would be http://mycompany.com/pengine.

The default will give you a standard pengines sandbox server. This will work fine if you just want to run
prolog code.

For example, [https://apps.nms.kcl.ac.uk/reactome-pengine/](pengines server that serves the data from Reactome) serves an index of human biological pathways. 

See below to run your own local pengines server. You'd want to do this if, for example, you had some prolog code that accessed a local database.

If you use localhost, you'll have issues because it will be promoted to https by node, and then not
like the lack of cert or self signed cert. You can avoid this by using your external ip address,
eg on my computer http://localhost:5000/pengine has this issue, but http://192.168.254.47/pengine works.

The localhost problem seems to not occur on Windows.

### Chunk Size

If you know you are going to get many solutions, you can turn the chunk size up and each pengine request will fetch
that many results. On the other hand, if you are likely to only actually want the first one, you want the chunk
size 1. Increasing chunk size commits to increased bandwidth and server load for the other solutions.

### Extra Knowledge

Additional Prolog code to be added to the knowledgebase. 

### Template

If your query is something like `foo(X, Y)` you're going to want X and Y.
Template tells pengines how to assemble the bound variables into a string. So, if you make the
template `X,"Y"`, and X is bound to 3, while Y is bound to `'Bob Smith'`, the message payload will
be `3,"Bob Smith"`.

## Making a local pengines server

The default URL points to a publicly available pengines server that just serves
a normal pengines sandbox.

If you want, you can run your own server easily.

You'll need a reasonably recent version of SWI-Prolog (7.4.0 or up should be fine.)

   swipl
   ?-doc_server(5000).
   ?- doc_server(5000).
	% Started server at http://localhost:5000/
	true.
	
	?- use_module(library(pengines)).
	true.

You should now have a pengines server on port 5000.

## I Don't Know Prolog

If you don't know Prolog, you can do most basic queries with this introduction.

### Atoms and Variables

Prolog is case sensitive. Variables start with an uppercase letter, so `ThisIsAVariable`.
All other identifiers are atoms, which either start
with a lowercase letter, and consist of letters, numbers, and underscore: `this_is_an_atom`, 
or are enclosed in single quotes: `'!Wow, also an atom!'`.  `'taxes'` and `taxes` 
are the same atom - the single quotes are optional here.

### Queries

Most pengines queries are simply a call to a single predicate (sort of like a function in Prolog). 

---
    employee_info('Bob Smith', Position, Salary)
---

The results will *bind* Position and Salary to whatever's appropriate for Bob.  
This means we can ask strange questions like
who has a salary of 85000.

---
    employee_info(Name, Position, 85000)
---

It's up to the implementer on the Prolog side which of of these 'modes' are 
actually implemented. You'll need to check with the documentation of the Prolog code. 
A commonly used convention in the Prolog community is to write a + meaning the argument 
must be supplied, a - to mean the predicate will fill it in, and ? to mean either is acceptable.  
So, we can probably ask for any combination of arguments for employee_info. This would 
be documented as employee_info(?, ?, ?).


### Underscore

We really didn't ask for the position, we just wanted the name. So we can put an underscore 
in the second argument to say we're not interested in it.

---
    employee_info(Name, _, 85000)
---

### Strings

Notice that Bob's name is an atom.  Prolog also has "real strings", and "codes strings". 
All get converted to js Strings.

### Nondeterminism

Now, if we happen to have two Bob Smiths in the company?  We'll get two messages. 
If there is no Bob Smith, we'll get no data. So sending the node a single message might result 
in zero, one, or many messages.

One tricky bit about this.  Prolog returns all the ways it can 'prove' the employee 
info is true. This sometimes means it will return multiple copies of a single 
answer. If you need rows to be distinct, work with the Prolog programmer. Usually public API's will have handled this.

### Limiting answers

I said above that most queries are a single predicate. An exception to that is that 
you might want to limit your query to a range. Here's how to do it.

---
    (employee_info(Name, _, Salary), Salary > 85000, Salary =< 120000)
---

The commas mean 'and' in this context. You can use another predicate as well. 
Say you have `department(Name, Department)` and want to find salaries of employees in 
marketing, similar to an SQL join.

---
    (employee_info(Name, _, Salary), department(Name, marketing))
---

Notice, as an aside, that marketing is an atom. 

## Making a new version

 * Do your work on dev branch or a branch off of dev
 * test by manually installing as above
 * merge back to dev and test
 * switch to master and merge back to master
 * Increment the version in `package.json`
 * Commit locally with a commit message that this is a release
 * git tag -a "<version #>" -m "message saying whats updated"
 * git push --tags origin master
 * npm whoami
 * if you are not swiprolog `sudo npm login` and provide the swiprolog credentials
 * sudo npm publish
 * announce the change on the node-red forums and slack

## Contributors

If you make a PR, please update this section. Besides bragging rights, it's useful for maintainers who come
after.

   * Anne Ogborn (Anniepoo on github) - original code
   * brianx - much advice, alpha testing
   * Raivo Laanemets - NPM package
