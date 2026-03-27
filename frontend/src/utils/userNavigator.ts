export const getUserNavigator = (): string | null => {
  return sessionStorage.getItem('userName');
};

export const getEmailNavigator = (): string | null => {
  return sessionStorage.getItem('email');
};
