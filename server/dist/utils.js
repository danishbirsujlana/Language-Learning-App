"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const checkToken = (par) => {
    let token = '';
    if (par && par.startsWith('Bearer')) {
        token = par.split(' ')[1];
    }
    if (!token) {
        return "";
    }
    return token;
};
exports.checkToken = checkToken;
