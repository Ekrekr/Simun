# Simon
A website for experimenting with agent sharing. Client and server side built on Node JS.

## Prerequisites
 * nodejs. [Example using homebrew for mac users](https://www.dyclassroom.com/howto-mac/how-to-install-nodejs-and-npm-on-mac-using-homebrew)
 * [Sass](https://sass-lang.com/), to generate css. To install sass do `sudo gem install sass`.
 * [Pug](https://www.npmjs.com/package/pug), to generate html. To install pug do `npm install pug`.
 * Global installation of [npm standard module](https://www.npmjs.com/package/standard) for running tests. This can be done by `npm install standard --global`

## Running Tests
All should be run inside the **site** directory
 * Coding style: `standard --fix`, or to ignore fixing just `standard`
 * Function tests: `npm test tests`
 * End to end tests: *TODO*

## Deployment
 * Start the server (from **site** directory): `npm start`. This is the combination of multiple commands:
   * Recompile all public html: `pug public/index.pug`
   * Recompile all public css: `sass /public/style/main.scss`
   * Start the server: `node server/server`

## Built With
 * [Bootstrap](https://www.npmjs.com/package/bootstrap)
 * [css](https://www.npmjs.com/package/css)
 * [express](https://www.npmjs.com/package/express)
 * [request](https://www.npmjs.com/package/request)
 * [chai](https://www.npmjs.com/package/chai)
 * [mocha](https://www.npmjs.com/package/mocha)
 * [standard](https://www.npmjs.com/package/standard)
 * [Express](https://www.npmjs.com/package/standard)
 * [node-sass](https://www.npmjs.com/package/node-sass)
 * [pug](https://www.npmjs.com/package/pug)
 * [pug-cli](https://github.com/pugjs/pug-cli)

## Development
### Useful commands
 * Start dev mode: `node run dev`. Then just open public/index.html

### Useful Links
 * [Building a NodeJS web app without external packages](https://medium.freecodecamp.org/a-no-frills-guide-to-node-js-how-to-create-a-node-js-web-app-without-external-packages-a7b480b966d2)
 * [npm structure suggestions](https://blog.risingstack.com/node-hero-node-js-project-structure-tutorial/)
 * [Automated testing](https://hackernoon.com/a-crash-course-on-testing-with-node-js-6c7428d3da02)
 * [Markdown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
 * [Readme template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
 * Pug website 

### Design
* Follow this colour sheet in general
![colour sheet](design/colour_scheme.png)
* Title font is [Glacial-indifference](http://scripts.sil.org/). Main font is Open Sans.

## License
This project is licensed under the GNU GPLv3 license; see LICENSE file for details
