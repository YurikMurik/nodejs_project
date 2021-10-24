import { store } from './store';

export const getAutoSuggestUsers = (loginSubstring: string, limit = 2) => {
    if (isNaN(limit)) {
        return [];
    }

    const newData = store
        .map((e) => {
            if (e.login.indexOf(String(loginSubstring)) !== -1) {
                return e;
            }
        })
        .slice(0, limit)
        .sort((a, b) => a.login.localeCompare(b.login));

    if (newData[0] === null) {
        return [];
    }

    return newData;
};

export const isAlreadyExistsItem = (login: string) =>
    Boolean(store.find((e) => e.login === login));
