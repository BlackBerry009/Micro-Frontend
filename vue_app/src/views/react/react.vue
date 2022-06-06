<template>
  <div></div>
</template>
<script>
import {createRoot} from 'react-dom/client';
import React from 'react';

// 加载一个 CommonJs 模块，只注入特定的几个依赖，并且将加载的结果在内存中缓存避免重复加载
const cache = {};
const load = js => {
  if (js in cache) return cache[js];
  cache[js] = fetch(js)
    .then(res => res.text())
    .then(code => {
      const module = { exports: {} };
      // eslint-disable-next-line no-new-func
      new Function('require, exports, module', code)(
        dep => {
          switch (dep) {
            case 'react':
              return React;
            case 'react-dom':
              return ReactDOM;
            default:
              throw new Error(`Failed to require('${dep}')`);
          }
        },
        module.exports,
        module
      );
      return module.exports;
    });
  return cache[js];
};

export default {
  methods: {
    renderReact() {
      const { $el, $route } = this;
      const { js } = Object($route.meta);
      const { Suspense, lazy, createElement } = React;
      const token = 'token123213';
      const user = {name: 'art', age: '18'}
      const root = createRoot($el);
      // 通过 ReactDOM 渲染一个 React 组件到 Vue 组件的 $el 上，同时将 user 和 token 作为 props 传入
      root.render(
        createElement(
          Suspense,
          { fallback: createElement('div', {}, '') },
          createElement(
            lazy(() => load(js)),
            { user, token }
          )
        )
      );
    }
  },
  // 页面路由变化时重新渲染
  watch: {
    $route() {
      this.renderReact();
    }
  },
  // 初始渲染
  mounted() {
    this.renderReact();
  }
};
</script>
