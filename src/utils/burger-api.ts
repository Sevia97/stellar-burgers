import { setCookie, getCookie } from './cookie';

export const BASE_URL =
  process.env.BURGER_API_URL || 'https://norma.education-services.ru/api';

const checkResponse = (res: Response) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

const request = (endpoint: string, options?: RequestInit) =>
  fetch(`${BASE_URL}/${endpoint}`, options).then(checkResponse);

export const getIngredientsApi = () =>
  request('ingredients').then((response) => response.data);

export const orderBurgerApi = (ingredients: string[]) =>
  request('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('accessToken') || ''
    },
    body: JSON.stringify({ ingredients })
  });

export const loginUserApi = (credentials: {
  email: string;
  password: string;
}) =>
  request('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

export const registerUserApi = (userData: {
  email: string;
  password: string;
  name: string;
}) =>
  request('auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

export const logoutApi = () =>
  request('auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  });

export const getUserApi = () =>
  request('auth/user', {
    headers: {
      Authorization: getCookie('accessToken') || ''
    }
  });

export const updateUserApi = (userData: {
  email: string;
  name: string;
  password?: string;
}) =>
  request('auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getCookie('accessToken') || ''
    },
    body: JSON.stringify(userData)
  });

export const forgotPasswordApi = (email: string) =>
  request('password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  request('password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

export const getOrderHistoryApi = () =>
  request('orders', {
    headers: {
      Authorization: getCookie('accessToken') || ''
    }
  }).then((response) => response.orders);
