import React from 'react';
import { Link } from 'react-router-dom';
import { baseRoutes } from './routes';


export default function Home() {
  return (
    <div>
      <ul>
        {baseRoutes.map(({ name, path, componentName, hide }) => {
          return (
            <li key={path} className={hide ? styles.hide : ''}>
              <Link to={path}>{name}</Link>
              <span>{path}</span>
              <strong>{componentName}</strong>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
