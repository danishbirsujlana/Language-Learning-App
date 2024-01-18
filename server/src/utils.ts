type FuncType = (par: string | undefined) => string

export const checkToken: FuncType = (par) => {
    let token = '';
    if (par && par.startsWith('Bearer')) {
        token = par.split(' ')[1];
    }
    if (!token) {
        return "";
    }
    return token;
};