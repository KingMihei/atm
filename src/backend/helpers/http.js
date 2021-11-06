import fetch from 'node-fetch';

class Http {
    constructor() {
        this.token = '3d80d59cb67f912c36c2d7a8a7fefcd7';
    }

    /**
     * Возвращает объект, содержащий курсы валют
     * @return {Promise<*>}
     */
    async parseRates() {
        let data;
        try {
            data = await fetch(`http://data.fixer.io/api/latest?access_key=${this.token}`, {
                method: "GET"
            }).then(async (res) => {
                return res.json();
            });
        } catch (e) {
            console.log('Ошибка получения данных', e);
        }

        return data;
    }
    /**
     * Возвращает объект, содержащий аббревиатуры валют
     * @return {Promise<*>}
     */
    async parseSymbols() {
        let data;
        try {
            data = await fetch(`http://data.fixer.io/api/symbols?access_key=${this.token}`, {
                method: "GET"
            }).then(async (res) => {
                return res.json();
            });
        } catch (e) {
            console.log('Ошибка получения данных', e);
        }

        return data;
    }

    /**
     * Возвращает код флага для svg изображения в папке assets/svg/flags
     * @return {Promise<*>}
     */
    async parseFlagByFullName(fullName) {
        const cc = require('currency-codes');
        let data;
        let flag;
        try {
            data = await fetch(`https://flagcdn.com/en/codes.json`, {
                method: "GET"
            }).then(async (res) => {
                return res.json();
            });
        } catch (e) {
            console.log('Ошибка получения флага', e);
        }

        let currencyObj = cc.code(fullName);

    try {
        flag = await Object.keys(data).find(key => data[key] === currencyObj.countries[0]);
    } catch (e) {
        return 'empty';
        console.log('Ошибка получения флага. Страна не найдена', e);
    }
        if (flag !== undefined) {
            return flag;
        } else {
            return 'empty';
            console.log('Ошибка получения флага. Страна не найдена');
        }

    }
}
export default new Http();