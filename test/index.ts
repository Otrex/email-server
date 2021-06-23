// eslint-disable-next-line import/prefer-default-export
export const authorizationHeader = (token: string) => ({ authorization: `Bearer ${token}` });
