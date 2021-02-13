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
  votes: any = [];

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
          let cvotes=[];
          element.states.forEach((el) => {
              const votes = this.extractVotes(el.votes);
              const sta = {name: `${el.statenumber} ${el.statename} ${el.statetype}`, votes};
              country['states'].push(sta);
              cvotes = (cvotes && cvotes.length ? cvotes.map(( v , index ) => {
                v = v + votes[index];
                return v;
              }) : votes);
          });
          this.votes[i] = cvotes;
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

  updatevotes = (country, state, vote, value) => {
    const currentValue = this.data.countries[country].states[state].votes[vote].count;
    console.log(currentValue);
    this.votes[country][vote] = this.votes[country][vote]  - currentValue + parseInt(value) ;
    this.data.countries[country].states[state].votes[vote] = parseInt(value);
  }
}
