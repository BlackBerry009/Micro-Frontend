import React from 'react';
import * as modules from './modules';
import rawRoutes from './routes.json';

console.log('sss', modules);
class Route {
  name;
  path;
  hide;
  componentName;
  component;
  constructor(raw) {
    this.name = String(raw.name);
    this.path = String(raw.path);
    this.hide = Boolean(raw.hide);
    this.componentName = raw.componentName;
    const key = raw.componentName;
    if (key in modules) {
      console.log('enter');
      this.component = () =>
        React.createElement(modules[key]);
    } else {
      console.log('null');
      this.component = () => null;
    }
  }
}

export const baseRoutes = [
  {
    name: 'Home',
    path: '/',
    componentName: 'Home',
  },
]
  .concat(rawRoutes)
  .map((i) => new Route(i));

console.log('bbb', baseRoutes);
