import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import starredSlice from '../data/starredSlice'
import watchLaterSlice from '../data/watchLaterSlice'
import { act } from 'react-dom/test-utils';

// Create a custom render function
const customRender = (ui, options) => render(ui, { wrapper: ({ children }) => (
  <Provider store={configureStore({
    reducer: { 
      starred: starredSlice,
      watchLater: watchLaterSlice
    }
  })}>
    <BrowserRouter>{children}</BrowserRouter>
  </Provider>
), ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

export async function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { 
        starred: starredSlice,
        watchLater: watchLaterSlice
      },
      preloadedState
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  let renderResult;
  await act(async () => {
    renderResult = render(ui, { wrapper: Wrapper, ...renderOptions });
  });

  return {
    ...renderResult,
    store,
  };
}

export function setupApiStore(api, extraReducers = {}, withoutListeners = false) {
  const getStore = () =>
    configureStore({
      reducer: { [api.reducerPath]: api.reducer, ...extraReducers },
      middleware: (gdm) =>
        gdm({ serializableCheck: false, immutableCheck: false }).concat(api.middleware),
    });

  const initialStore = getStore();
  const refObj = {
    api,
    store: initialStore,
  };

  return refObj;
}