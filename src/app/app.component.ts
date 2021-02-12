import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
