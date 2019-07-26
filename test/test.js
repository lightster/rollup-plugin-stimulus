import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { rollup } from 'rollup';
import stimulus from '../';
import test from 'ava';

function bundle(input, config) {
  const warnings = [];

  return rollup({
      input: `./test/fixtures/${input}`,
      plugins: [
        stimulus(config),
        resolve(),
        commonjs(),
      ],
      onwarn: (warning) => {
        warnings.push(warning);
      }
    })
    .then(bundle => bundle.generate({format: 'esm'}))
    .then(generated => {
      return {generated, warnings}
    });
}

function runBundle(input, config) {
  return bundle(input, config)
    .then(({generated}) => {
      return (new Function(
        generated.output[0].code.replace('export default ', 'return ')
      ))();
    });
}

test('plugin works without any configuration', t => {
  return runBundle('default.js').then(controllers => {
    t.is(controllers.length, 3);
    t.deepEqual(
      controllers.map(controller => controller.identifier),
      controllers.map(controller => controller.controllerConstructor.name),
    );
  });
});

test('string config sets basePath', t => {
  const config = 'test/fixtures/controllers';
  return runBundle('entrypoints/index.js', config).then(controllers => {
    t.is(controllers.length, 3);
    t.deepEqual(
      controllers.map(controller => controller.identifier),
      controllers.map(controller => controller.controllerConstructor.name),
    );
  });
});

test('basePath can be passed to config object', t => {
  const config = {basePath: './test/fixtures/controllers'};
  return runBundle('entrypoints/index.js', config).then(controllers => {
    t.is(controllers.length, 3);
    t.deepEqual(
      controllers.map(controller => controller.identifier),
      controllers.map(controller => controller.controllerConstructor.name),
    );
  });
});

test('importName can be customized', t => {
  const config = {
    basePath: 'test/fixtures/controllers',
    importName: 'custom-import-name',
  };
  return runBundle('entrypoints/custom-import-name.js', config).then(controllers => {
    t.is(controllers.length, 3);
    t.deepEqual(
      controllers.map(controller => controller.identifier),
      controllers.map(controller => controller.controllerConstructor.name),
    );
  });
});

test('"this is undefined" warnings for @stimulus libraries are suppressed', t => {
  const config = 'test/fixtures/controllers';
  return bundle('entrypoints/with-stimulus.js', config).then(({warnings}) => {
    t.is(warnings.length, 0);
  });
});

test('"this is undefined" warnings for @stimulus libraries can be re-enabled', t => {
  const config = {
    basePath: 'test/fixtures/controllers',
    showWarnings: true,
  };
  return bundle('entrypoints/with-stimulus.js', config).then(({warnings}) => {
    t.true(warnings.length > 0);
  });
});
