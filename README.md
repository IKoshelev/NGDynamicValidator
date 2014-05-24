NGDynamicValidator
==================

An AngularJS directive for advanced forms validation scenarios. Targeted at enterprise level Angular applications.

Written in TypeScript. If you are new to TS, the thing you need to know is, it compiles to idiomatic human readable JS (in fact, it is very hard to notice a JS file that was compiled from TS) and those files are served to the browser / used with your JS code. Look inside src folder to see, what I mean. It is a superset of JS (any valid JS is valid TS) and if you know JS - you will have no trouble reading TS. If you want to know more about TS - http://www.typescriptlang.org/  

Demo site is under way. It will be based on the examples from E2E spec, that is already present (and hopefully finished), so you can use it. To see all the examples that will be used as the demo run
<br/><strong>npm start</strong><br/>
and navigate to http://localhost:8000/e2e/

Repo contains all the needed NodeJS infrastructure to modify and test the project.

If you are interested in cloning the whole repo - make sure you run
<br/><strong>npm run install-dep</strong><br/>
after you clone it - this will install all Node and Bower components.

A TS compiler is included and available with
<br/><strong>npm run compile-ts</strong><br/>
or
<br/><strong>grunt compile-ts</strong><br/>

Test are ran via 
<br/><strong>npm run karma</strong><br/>
and
<br/><strong>npm run protractor</strong><br/>
