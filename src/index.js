import { format } from 'util';
import Config from './config';
import Controller from './controller.js';

function generateImport({importIdentifier: ctrl, path}) {
  return format('import %s from %j;\n', ctrl, path);
}

function generateExport({identifier: id, importIdentifier: ctrl}) {
  return format('  {identifier: %j, controllerConstructor: %s},\n', id, ctrl);
}

function generateControllersImport(config) {
  const controllers = Controller.findAllInDirectory(config.basePath);

  let imports = '';
  let exports = '\nexport default [\n';
  for (const controller of controllers) {
    imports += generateImport(controller);
    exports += generateExport(controller);
  }
  exports += '];\n';

  return imports + exports;
}

export default function rollupPluginStimulus(moduleConfig) {
  let config = new Config();

  return {
    name: "rollup-plugin-stimulus",

    options(options) {
      config.configure(moduleConfig, options);
    },

    resolveId(id) {
      if (`\0${id}` === config.importName) {
        return config.importName;
      }

      return null;
    },

    load(id) {
      if (id !== config.importName) {
        return;
      }

      return generateControllersImport(config);
    }
  };
}
