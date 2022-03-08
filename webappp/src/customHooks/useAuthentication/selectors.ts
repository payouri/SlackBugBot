import { RootState } from '../../store';

export const getAuthenticationState = (state: RootState) => state.auth;
