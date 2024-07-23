import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import starredSlice from '../data/starredSlice'
import watchLaterSlice from '../data/watchLaterSlice'
import { moviesApi } from '../services/movies'

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        [moviesApi.reducerPath]: moviesApi.reducer,
        starred: starredSlice,
        watchLater: watchLaterSlice
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(moviesApi.middleware),
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {

  setupListeners(store.dispatch)

  function Wrapper({ children }) {
    return <Provider store={store}><BrowserRouter>{children}</BrowserRouter></Provider>;
  }

  // Create an array to store dispatched actions
  const actions = []

  // Wrap the store's dispatch method to capture actions
  const originalDispatch = store.dispatch
  store.dispatch = jest.fn((action) => {
    actions.push(action)
    return originalDispatch(action)
  })

  // Define getActions function
  const getActions = () => actions

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }), getActions };
}

export function setupApiStore(moviesApi, extraReducers = {}, withoutListeners = false) {
  const getStore = () =>
    configureStore({
      reducer: { [moviesApi.reducerPath]: moviesApi.reducer, ...extraReducers },
      middleware: (gdm) =>
        gdm({ serializableCheck: false, immutableCheck: false }).concat(moviesApi.middleware),
    });

  const initialStore = getStore();
  const refObj = {
    moviesApi,
    store: initialStore,
  };

  return refObj;
}