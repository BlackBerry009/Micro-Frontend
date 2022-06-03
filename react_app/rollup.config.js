import { builtinModules } from 'module';
import babel from '@rollup/plugin-babel';
import url from '@rollup/plugin-url';
import alias from '@rollup/plugin-alias';
import postcssUrl from 'postcss-url';
import postcss from 'rollup-plugin-postcss';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import less from 'less';
import pkg from './package.json';
import path from 'path';
import fs from 'fs';
import commonjs from '@rollup/plugin-commonjs';

const projectRootDir = path.resolve(__dirname);
const dirs = fs.readdirSync('src/modules');

export default dirs.map((moduleName) => {
  return {
    input: `src/modules/${moduleName}/index.tsx`,
    output: [
      {
        file: `build/esm/${moduleName}.js`,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: `build/cjs/${moduleName}.js`,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
    ...getCommonConfig(pkg.main),
  };
});

function getCommonConfig(file) {
  return {
    plugins: [
      postcss({
        loaders: [
          {
            name: 'less',
            test: /\.less$/,

            async process({ code, map }) {
              const reg = new RegExp(`(@import.*?)(["'])@(["'/])(.*?;)`, 'g');
              code = code.replace(
                reg,
                `$1$2${path.resolve(__dirname, 'src')}$3$4`,
              );
              const { css } = await less.render(code, {
                javascriptEnabled: true,
              });

              return {
                code: css,
              };
            },
          },
        ],
        extract: false,
        inject: true,
      }),
      alias({
        entries: [
          { find: '@', replacement: path.resolve(projectRootDir, 'src') },
        ],
      }),
      resolve({
        extensions: ['.js'],
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/,
      }),
      url(),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        extensions: [...DEFAULT_EXTENSIONS],
      }),
    ],
    external: [
      ...builtinModules,
      'react',
      'react-dom',
    ],
  };
}
