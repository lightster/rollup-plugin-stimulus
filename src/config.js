function processBasePath(moduleConfig, rollupOptions) {
  if (moduleConfig.rawBasePath) {
    return moduleConfig.rawBasePath;
  }

  let basePath = moduleConfig.basePath;
  if (!basePath) {
    basePath = rollupOptions.input.replace(/\/+$/, '');
    const baseNamePosition = basePath.lastIndexOf('/');
    if (baseNamePosition !== -1) {
      basePath = basePath.substring(0, baseNamePosition) + '/controllers';
    }
  }

  if (!basePath.startsWith('/') && !basePath.startsWith('./')) {
    basePath = `./${basePath.replace(/\/+$/, '')}`;
  }

  return basePath;
}

class Config
{
  constructor() {
    this.importName = '\0stimulus-controllers';
    this.basePath = null;
  }

  configure(moduleConfig, rollupOptions) {
    if (!moduleConfig) {
      moduleConfig = {};
    } else if (typeof moduleConfig === 'string') {
      moduleConfig = {
        basePath: moduleConfig
      };
    }

    this.basePath = processBasePath(moduleConfig, rollupOptions);
    if (moduleConfig.importName) {
      this.importName = `\0${moduleConfig.importName}`;
    }

    if (!moduleConfig.showWarnings) {
      const originalWarnHandler = rollupOptions.onwarn;
      rollupOptions.onwarn = function(warning, warn) {
        if (warning.code === 'THIS_IS_UNDEFINED'
          && warning.loc.file.includes('/@stimulus/')
        ) {
          return;
        }

        if (originalWarnHandler) {
          originalWarnHandler(warning, warn);
        } else {
          warn(warning);
        }
      };
    }
  }
}

export default Config;
