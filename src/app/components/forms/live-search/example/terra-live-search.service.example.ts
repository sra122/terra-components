import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';


interface ContactInterface
{
    name:string;
    age:number;
    gender?:string;
}

@Injectable()
export class TerraLiveSearchServiceExample
{
    private contacts:Array<ContactInterface> = [
        {
            name: 'Michaela Mustermann',
            age: 41,
            gender: 'female'
        },
        {
            name: 'Pascal Weyrich',
            age: 28,
            gender: 'male'
        }
    ];

    public getContacts(name:string):Observable<Array<any>>
    {
        console.log('Search: name = ' + name);
        return of(this.contacts.filter((contact:ContactInterface) => contact.name.includes(name)));
    }
}