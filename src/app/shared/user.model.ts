export class User {
    constructor(
        public email: string, 
        public id: string, 
        private _token: string, 
        private _tokenExporationDate: Date
    ) {}

    get token() {
        if (!this._tokenExporationDate || new Date() > this._tokenExporationDate) {
            return null;
        }
        return this._token;
    }
}