# npm-introspect

:mag_right: Introspect is a command line tool to examine and visualize the quality of your project's dependencies.

![image of introspect visualization](https://github.com/Nohmapp/npm-introspect/blob/master/assets/screenshot.png?raw=true)

## The Problem

Have you ever searched for a module in npm and found 20 different, uniquely inadequate options?

There's 20 different packages, most of them are incomplete or unused. 7 of them might do what you want, one is specialized for a use case different than yours, three have very little documentation, one is reportedly 'bloated', another is fairly new and supported by a small group- finding quality packages is difficult and npm lacks the built in support to do it.

[Npm](https://www.npmjs.com/) contains more than double the amount of packages of the next most populated package manager. It is a victim of its own success. Npm is a market of imperfect information, poor packages can have many github stars and common use cases often lack a clear, well-maintained solution.

## The Solution

[Npms.io](https://npms.io/) is an effort to clearly signal code quality so that the npm community can converge on the best modules to use and maintain. Npms computes scores for npm modules across quality, maintenance, and popularity. Npm-introspect is a tool that uses the npms scores and other npm package data to create rich visualizations to explore the packages on which our projects depend. Run introspect in your project root and it will parse the packages in your package.json and launch the visualization locally. There is also a command to skip the visualization and output the most important data to the command line.

Promote a transparent and more functional open source ecosystem. Use npm-introspect and [npms.io](https://npms.io/)

## Installation

```bash
npm i npm-introspect -g
```
## Usage

```bash
introspect [any additional packages to analyze] [port] 
```
Run ```introspect``` in the root directory of any project you are interested in analyzing. It will parse the package.json and return a visualization of your project's dependencies. It will throw an error if it does not find a package.json.

If you want to run introspect with less overhead use the -less option, or -l flag.
With the -l flag introspect will output scores to the terminal and not startup a server.

```bash
introspect [any additional packages to analyze] [less] 
```

## Example
```bash
introspect react redux kefir -p 5000
```

![gif of introspect being launched](https://github.com/Nohmapp/npm-introspect/blob/master/assets/screenshot.gif?raw=true)

Here is an example with the less option

```bash
introspect react redux kefir -l
```
![gif of introspect with less](https://github.com/Nohmapp/npm-introspect/blob/master/assets/less.gif?raw=true)

![png of introspect with less option](https://github.com/Nohmapp/npm-introspect/blob/master/assets/screenshot_less.png?raw=true)

### License
[MIT](https://opensource.org/licenses/MIT)
