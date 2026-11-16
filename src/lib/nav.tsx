import { createContext, useContext } from 'react';
import type { Route } from './router';

export const NavContext = createContext<(route: Route) => void>(() => undefined);

export const useNav = () => useContext(NavContext);
