import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { UserContext } from '../context/UserContext';
import LandingPage from './LandingPage';
import { CHECK_AUTH } from '../graphql/queries/checkAuth';
import { LOGIN_USER } from '../graphql/mutations/loginUser';
import { FETCH_ALL_GAMES } from '../graphql/queries/fetchGamesAll';

beforeAll(() => {
  const localStorageMock = (function () {
    let store = {};

    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      clear() {
        store = {};
      },
      removeItem(key) {
        delete store[key];
      },
    };
  })();

  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
  });
});

const mockStore = configureStore([]);

const renderWithProviders = ({ user = null, loading = false, mocks = [] }) => {
  const store = mockStore({
    auth: {
      user: null,
      token: null,
    },
  });

  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Provider store={store}>
        <UserContext.Provider value={{ user, setUser: jest.fn(), loading }}>
          <BrowserRouter>
            <LandingPage />
          </BrowserRouter>
        </UserContext.Provider>
      </Provider>
    </MockedProvider>
  );
};

describe('LandingPage component', () => {
  it('renders loading state', () => {
    renderWithProviders({ loading: true });
    expect(screen.getByText(/ładowanie/i)).toBeInTheDocument();
  });

  it('renders login button when no user', async () => {
    renderWithProviders({ user: null, loading: false });
    expect(screen.getByText(/LoginDebugging/i)).toBeInTheDocument();
  });

  it('renders welcome message when user is present', () => {
    const fakeUser = { email: 'test@example.com' };
    renderWithProviders({ user: fakeUser, loading: false });
    expect(screen.getByText(/Witaj, test@example.com!/i)).toBeInTheDocument();
  });

  it('calls login mutation on debug login click', async () => {
    const loginMock = {
      request: {
        query: LOGIN_USER,
        variables: { email: "testuje@wp.pl", password: "12qwaszx" },
      },
      result: {
        data: {
          loginUser: {
            token: JSON.stringify({ uid: { email: 'test@example.com' }, "access-token": "abc123" }),
          },
        },
      },
    };

    renderWithProviders({ user: null, loading: false, mocks: [loginMock] });

    fireEvent.click(screen.getByText(/LoginDebugging/i));

    await waitFor(() =>
      expect(screen.queryByText(/Zalogowano!/i)).not.toBeNull()
    );
  });

  it('handles fetch all games button click', async () => {
    const fetchGamesMock = {
      request: {
        query: FETCH_ALL_GAMES,
      },
      result: {
        data: {
          games: [{ id: '1', title: 'Test Game' }],
        },
      },
    };

    renderWithProviders({ user: { email: 'test@example.com' }, loading: false, mocks: [fetchGamesMock] });

    fireEvent.click(screen.getByText(/TestFetchAllGamesButton/i));

    await waitFor(() => {
      // Możesz sprawdzić log, lub podmienić logikę w komponencie na pokazanie danych.
      expect(console.log).toBeCalled();
    });
  });
});
