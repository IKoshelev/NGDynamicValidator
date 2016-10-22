Warning!
==================

This project is not actively maintained and Angular has moved considerably ahead since it was introduced (around the time of Angular 1.2). 

NGDynamicValidator
==================

An AngularJS directive for advanced forms validation scenarios. Targeted at enterprise level Angular applications.

It also serves for E2E testing - the spec is ran against it, and is included in this repo. To access it offline run 
<pre><code>npm start</code></pre>
and navigate to http://localhost:8000/e2e/

Written in TypeScript. If you are new to TS, the thing you need to know is, it compiles to idiomatic human readable JS (in fact, it is very hard to notice a JS file that was compiled from TS) and those files are served to the browser / used with your JS code. Look inside src folder to see, what I mean. It is a superset of JS (any valid JS is valid TS) and if you know JS - you will have no trouble reading TS. If you want to know more about TS - http://www.typescriptlang.org/  

Repo contains all the needed NodeJS infrastructure to modify and test the project.

If you are interested in cloning the whole repo - make sure you run
<pre><code>npm run install-dep</code></pre>
after you clone it - this will install all Node and Bower components.

A TS compiler is included and available with
<pre><code>npm run compile-ts</code></pre>
or
<pre><code>grunt compile-ts</code></pre>

Test are ran via 
<pre><code>npm run karma</code></pre>
and
<pre><code>npm run protractor</code></pre>
