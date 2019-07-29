# rollup-plugin-stimulus
Roll Stimulus.js applications, including autoloading of controllers.

## Installation

```bash
npm install --save-dev rollup-plugin-stimulus
```

In addition to installing the plugin, you will likely want to install `stimulus` so you can
initialize the application.  You will also likely want to use `rollup-plugin-node-resolve` if you
install Stimulus via npm. 

```bash
npm install --save-dev stimulus
npm install --save-dev rollup-plugin-node-resolve 
```

## Simple Usage

Configure your Rollup bundle to initialize the `rollup-plugin-stimulus` and `resolve` plugins:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import stimulus from 'rollup-plugin-stimulus';

export default [{
  input: 'src/app.js',
  output: {
    file: 'dist/app.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    stimulus(),
    resolve(),
  ],
}];
```

Loading `rollup-plugin-stimulus` gives you access to a `stimulus-controllers` import in your app
source code.  The `stimulus-controllers` import provides an array of controller definitions that you
can pass to Stimulus' `application.load` method.

```js
// src/app.js
import { Application } from 'stimulus';
import controllers from 'stimulus-controllers';

const application = Application.start();
application.load(controllers);
```

This will initialize a Stimulus app with any controllers named `[identifier]_controller.js` found in
the `controllers` directory at the same level of your Rollup input file.  For example, if your
Rollup input is `src/app.js`, files named `[identifier]_controller.js` will be looked for in
`src/controllers` and all subdirectories.

Controllers' `data-controller` identifiers follow the
[conventions discussed in the Stimulus Handbook](https://stimulusjs.org/handbook/installing#controller-filenames-map-to-identifiers).
The file name identifier is converted to a `data-controller` identifier by replacing underscores
with a dash (`-`) and diretory separators (i.e. `/`) with double dashes (`--`).

As taken from the Stimulus manual:

| If your controller file is named… | its identifier will be… |
|-----------------------------------|-------------------------|
| clipboard_controller.js           | clipboard               |
| date_picker_controller.js         | date-picker             |
| users/list_item_controller.js     | users--list-item        |
| local-time-controller.js          | local-time              |

## Configuration

While `rollup-plugin-stimulus` is designed to work without configuration, there are some options you
can configure:

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import stimulus from 'rollup-plugin-stimulus';

export default [{
  input: 'src/app.js',
  output: {
    file: 'dist/app.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    stimulus({
      // the directory your controllers are stored in
      basePath: './src/controllers',

      // the name that is used to import Stimulus controllers in the app
      importName: 'stimulus-controllers',

      // whether or not to show 'this is undefined' warnings when importing @stimulus modules
      showWarnings: false,
    }),
    resolve(),
  ],
}];
```
