import { emptySplitApi } from './';
import { City } from './weather';

export interface User {
  id: number;
  email: string;
  joinDate: Date;
  isStaff: boolean;
  savedCity: City | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
  accessTokenExpiration: Date;
}

export interface LogoutRespone {
  detail: string;
}

export interface RegisterRequest {
  email: string;
  password1: string;
  password2: string;
}

export interface RegisterRespone {
  detail: string;
}

export interface saveUserCityRequest {
  savedCity: number;
}

export interface saveUserCityResponse extends Omit<User, 'savedCity'> {
  savedCity: number;
}

export const authApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getLoggedUser: build.query<User, void>({
      query: () => ({
        url: 'dj-rest-auth/user/',
      }),
    }),
    saveUserCity: build.mutation<saveUserCityResponse, saveUserCityRequest>({
      query: (data) => ({
        url: 'dj-rest-auth/user/',
        method: 'PATCH',
        body: data,
      }),
    }),
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: 'dj-rest-auth/login/',
        method: 'POST',
        body: data,
      }),
    }),
    register: build.mutation<RegisterRespone, RegisterRequest>({
      query: (credentials) => ({
        url: 'dj-rest-auth/register/',
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: build.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: 'dj-rest-auth/token/refresh/',
        method: 'POST',
      }),
    }),
    logout: build.mutation<LogoutRespone, void>({
      query: () => ({
        url: 'dj-rest-auth/logout/',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useLazyGetLoggedUserQuery,
  useRefreshTokenMutation,
  useRegisterMutation,
  useSaveUserCityMutation,
} = authApi;
