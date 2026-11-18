/**
 * Jest runs modules as CommonJS, where `import.meta` is a syntax error.
 * This Babel plugin replaces every `import.meta` with a plain object that offers the
 * properties code relies on (`url`, `env`, `hot`), so ESM-only packages such as
 * React Router (and Vite-style `import.meta.env` in our own code) work under Jest.
 */
module.exports = function importMetaPlugin({ template }) {
  const buildImportMeta = template.expression.ast(`({
    url: require('node:url').pathToFileURL(__filename).href,
    env: { MODE: 'test', DEV: false, PROD: false, ...process.env },
    hot: undefined,
  })`);

  return {
    name: 'jest-import-meta',
    visitor: {
      MetaProperty(path) {
        const { meta, property } = path.node;
        if (meta.name === 'import' && property.name === 'meta') {
          path.replaceWith(buildImportMeta);
        }
      },
    },
  };
};
