# Micro-Frontend
微前端解决方案的一种

本例演示在 Vue 中，嵌入 React 的方案

原理：React 每个 Page 都打包为一个 js 文件，将路由配置做番更改添加到 Vue 中去，点击 React 菜单时，加载对应的 js 文件

整体项目搭建框架是 vue 框架，下面的多级菜单都是 react 项目中的，合并在 vue 中。

![vue](/assets/vue.png)

![react](/assets/react.png)