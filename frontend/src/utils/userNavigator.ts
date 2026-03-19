export const getUserNavigator = (): string | null => {
    return sessionStorage.getItem('userName');
} 