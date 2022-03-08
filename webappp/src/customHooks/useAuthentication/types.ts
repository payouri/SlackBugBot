export type AuthenticationState = {
    token?: string;
    isAuthenticated: boolean;
    isLoading: boolean;
};

export type UseAuthenticationParams = {
    getBearer?: () => Promise<string>;
};

export type UseAuthenticationType = AuthenticationState & {
    signOut: () => void;
};
