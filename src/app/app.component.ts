import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  expand = [];
  data: any;
  rowData: any = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
      this.http
      .get('../assets/data.json')
      .subscribe((data: any) => {
          this.data = data;
          this.populateRowData();
      });
  }
  populateRowData = () => {
      const  rowDta: any = [];
      this.data.countries.forEach((element, i) => {
          this.expand.push(false);
          const country = {name: `${element.countrynumber} ${element.countryname}`};
          country['states'] = [];
          country['votes'] = [];
          element.states.forEach((el) => {
              const votes = this.extractVotes(el.votes);
              const sta = {name: `${el.statenumber} ${el.statename} ${el.statetype}`, votes};
              country['states'].push(sta);
              country['votes'] = (country['votes'] && country['votes'].length ? country['votes'].map(( v , index ) => {
                v = v + votes[index];
                return v;
              }) : votes);
          });
          rowDta.push(country);
        });
        this.rowData = rowDta;
  }
  extractVotes = (yourvotes) => {
    const votes = [];
    this.data.expectedVoteValues.forEach(element => {
        votes.push(yourvotes.find(x => x.date === element.date).count);
    });
    return votes;
  };
}
