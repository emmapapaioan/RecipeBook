export class Ingredient {
    public name: string;
    public amount :number;
    public id?: string;

    constructor(name: string, amount: number, id?:string){
        this.name = name;
        this.amount = amount;
        this.id = id ? id : null;
    }
}