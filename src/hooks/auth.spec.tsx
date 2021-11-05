import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { startAsync } from 'expo-auth-session';
import fetchMock from 'jest-fetch-mock';

import { AuthProvider, useAuth } from './auths';

jest.mock('expo-auth-session');
fetchMock.enableMocks();

describe('Auth Hook', () => {
  it('should be able to sign in with Google Account', async () => {
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: 'success',
      params: {
        access_token: 'any_token',
      }
    });
    //depois que mocka o token mockar a requisição ttp dos dados de profile do usuário.
    fetchMock.mockResponseOnce(JSON.stringify(
      {
        id: 'any_id',
        email: 'leandro.quadros@gmail.com',
        name: 'Leandro',
        photo: 'any_photo.png'
      } 
    ));
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    act(async () => await result.current.signInWithGoogle());
    await waitForNextUpdate();

    expect(result.current.user.email)
    .toBe('leandro.quadros@gmail.com');

  });

  it('user should noasdt connect if cancel authentication with Google', async () => {
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: 'cancel',
    });
    // depois que mocka o token mockar a requisição ttp dos dados de profile do usuário.
    // fetchMock.mockResponseOnce(JSON.stringify({}));
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    act(async () => await result.current.signInWithGoogle());
    await waitForNextUpdate();
    console.log("Tem usaurio?", result.current.user);
    expect(result.current.user).not.toHaveProperty('id');
  });

  it('should be error Signin Google', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    // Como o error acontece com uma exceção então fica no try catch
    try {
      await act(async () => await result.current.signInWithGoogle());
      await waitForNextUpdate();
      console.log("Tem usaurio?", result.current.user);
    } catch {
      expect(result.current.user).toEqual({});
    }
  });
});