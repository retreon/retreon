/* eslint-env node */
module.exports = function (babel) {
  babel.cache(true);

  return {
    presets: [
      require('@babel/preset-typescript'),
      [
        require('@babel/preset-env'),
        { modules: process.env.PRESERVE_MODULES ? false : undefined },
      ],
    ],
    plugins: [
      require('@babel/plugin-proposal-class-properties'),
      require('@babel/plugin-transform-runtime'),
    ],
  };
};
