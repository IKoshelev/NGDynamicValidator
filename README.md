NGDynamicValidator
==================

An AngularJS directive for advanced forms validation scenarios. Targeted at enterprise level Angular applications.

Written in TypeScript. If you are new to TS, the thing you need to know is, it compiles to idiomatic human readable JS (in fact, it is very hard to notice that a JS file that was compiled from TS) and those file are served to the browser. Look inside src folder to see, what I mean. If you want to know more about it - http://www.typescriptlang.org/  

Demo site is under way. It will be based on the E2E spec, that is already present, so you can use it. To see all the exmples that will be used as the demo run
<strong>npm start</strong>
and navigate to http://localhost:8000/e2e/

Repo contains all the needed NodeJS infrastructure to modify and test the project.

If you are interested in cloning the whole repo - make sure you run
<strong>npm run install-dep</strong>
after you clone it - this will install all Node and Bower components.

A TS compiler is included with
<strong>npm run compile-ts</strong>
or
<strong>grunt compile-ts</strong>

Test are ran via 
<strong>npm run karma</strong>
and
<strong>npm run protractor</strong>
