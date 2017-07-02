# npm-introspect

Introspect is a command line tool to examine and visualize package quality.

![gif of introspect being launched](https://github.com/Nohmapp/npm-introspect/blob/master/assets/screenshot.gif?raw=true)

## The Problem

Have you ever searched for a library in npm and found 30 different, uniquely inadequate options?

[Npm](https://www.npmjs.com/) contains more than double the amount of packages of the next most populated package manager. It is a victim of its own success. Npm is a market of imperfect information, poor packages can have many github stars and common use cases often lack a clear, well-maintained solution.

## The Solution

[Npms.io](https://github.com/npms-io/npms-analyzer) is an effort to clearly signal code quality so that the npm community can converge on the best modules to use and maintain. Npms computes scores for npm modules across quality, maintenance, and popularity. Npm-introspect is a tool that uses the npms scores and other npm package data to create rich visualizations to explore the packages on which our projects depend. Run introspect in your project root and it will parse the packages in your package.json and launch the visualization locally. There is also a command to skip the visualization and output the most important data to the command line.

Promote a transparent and more functional open source ecosystem. Use npm-introspect and [npms.io](https://npms.io/)

## Installation

```bash
npm i npm-introspect -g
```
## Usage

```bash
introspect [any additional packages to analyze] [port]
introspect react redux kefir -p 5000
```
If you want an option with less overhead run introspect with the -less option, or -l flag.

```bash
introspect react redux kefir -l
```

![gif of introspect with less option](https://github.com/Nohmapp/npm-introspect/blob/master/assets/less.gif?raw=true)


### License
[MIT](https://opensource.org/licenses/MIT)
