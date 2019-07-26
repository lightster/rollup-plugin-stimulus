import fs from 'fs';

/**
 * @param {string} basePath: the path to search for controllers in
 * @param {string} path: the path relative to the basePath to search
 */
function * iterateControllerFilesRecursive(basePath, path) {
  const dir = path ? `${basePath}/${path}` : basePath;
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
    return;
  }

  const files = fs.readdirSync(dir, {withFileTypes: true});

  for (let file of files) {
    const relativePath = path ? `${path}/${file.name}` : file.name;
    if (file.isDirectory()) {
      yield * iterateControllerFilesRecursive(basePath, relativePath);
      continue;
    }

    if (!file.isFile()) {
      continue;
    }

    const logicalName = (relativePath.match(/^(?:\.\/)?(.+)(?:[_-]controller\..+?)$/) || [])[1];
    if (logicalName) {
      const identifier = logicalName.replace(/_/g, '-').replace(/\//g, '--');
      yield new Controller(identifier, `${basePath}/${relativePath}`);
    }
  };
};

class Controller
{
  /**
   * @param {string} basePath: the path to search for controllers in
   * @returns Controller
   */
  static * findAllInDirectory(basePath) {
    yield * iterateControllerFilesRecursive(basePath, '');
  }

  constructor(identifier, path) {
    /**
     * The controller identifier to be used in the data-controller attribute,
     * generated using Stimulus' conventions
     *
     * @type {string}
     */
    this.identifier = identifier;

    /**
     * The path to the file containing the Controller's source, which should
     * export the Stimulus Controller as its default: `export default class`
     *
     * @type {string}
     */
    this.path = path;

    /**
     * The controller identifier converted to a format that is safe to use as a
     * JavaScript variable in the `import` statement.
     *
     * @type {string}
     */
    this.importIdentifier = 'import_' + this.identifier.replace(/-/g, '_');
  }
}

export default Controller;
