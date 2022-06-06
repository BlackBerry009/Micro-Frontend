import router from '@/router';
import { constantRoutes } from '@/router';
import Layout from '@/layout';
import RemoteReactComponent from '@/views/react/react.vue';

const BASEURL = 'localhost:5500/react_app/build';
const ROUTE_JSON_URL = `http://${BASEURL}/routes.json`

const addRoutePrefix = (str, children) => {
  return children.map((item) => {
    if (item.children.length === 0) {
      return {
        ...item,
        path: str + item.path,
      };
    } else {
      return addRoutePrefix(str, item.children)[0];
    }
  });
};

export const reactMenu = fetch(ROUTE_JSON_URL)
  .then((res) => res.json())
  .then((rawList) => {
    const reactRoutes = convertRewardPointRoutes(rawList);
    // 将路由分别加入 routes 和 router 中，前者是菜单渲染用的，后者是 VueRouter 定义
    constantRoutes.push(...reactRoutes);
    router.addRoutes(reactRoutes)
    console.log(router)
  })
  .catch((e) => {
    console.error(e);
  });

const convertRewardPointRoutes = (rawList) => {
  const routes = [];
  for (let i = 0; i < rawList.length; i++) {
    const { name, path, componentName, hide } = Object(rawList[i]);
    if (!name) continue;
    const sName = String(name).split(/\s*-\s*/g);
    console.log('sssss', { name, path, componentName, hide })
    const walk = (children, sName, index) => {
      console.log('sName', sName, index, children)
      const title = sName[index];
      let route = children.find((i) => i.meta.title === title);
      const isLeaf = index === sName.length - 1;
      console.log('is', isLeaf)
      if (!route) {
        route = { meta: { title }, children: [] };
        if (isLeaf) {
          route.path = path;
          route.name = title;
          route.component = RemoteReactComponent;
          route.meta.js = `http://${BASEURL}/cjs/${componentName}.js`;
          route.meta.hideInMenu = hide;
          route.meta.noTag = hide;
        } else {
          route.path = '/' + encodeURIComponent(title);
          route.name = title;
          // 根节点使用 Layout 组件渲染
          route.component = index ? null : Layout;
          route.meta.showAlways = true;
          console.log('234', route)
        }
        children.push(route);
      }
      if (!isLeaf) walk(route.children, sName, index + 1);
    };
    walk(routes, sName, 0);
  }
  return routes;
};
