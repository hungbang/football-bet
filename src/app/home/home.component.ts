import {Component, NgZone, OnInit} from '@angular/core';
import {Web3Service, SolobetService, MatchService} from '../../service/service';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  account: any;
  accounts: any;
  match = {matchId: '', homeTeam: '', awayTeam: '', homeGoals: 0, awayGoals: 0, time: 0, status: 0};

  upcommingMatches: any;
  bettings: any;
  amount: 0;
  rate1: 0;
  rate2: 0;

  constructor(private _ngZone: NgZone,
              private  web3Service: Web3Service,
              private  solobetService: SolobetService,
              private matchService: MatchService) {


    this.onReady();

  }

  initMatches = () => {

    this.upcommingMatches = new Array();
    this.matchService.getMatches().subscribe(result => {
      // this.upcommingMatches = result;
      for (let i = 0; i < result.length; i++) {
        let match = result[i];
        let mHash = match.match_hometeam_name + match.match_awayteam_name + match.match_date + match.match_time;

        var bettingMatch = {
          'id': this.web3Service.toSHA3(mHash),
          'homeTeam': match.match_hometeam_name,
          'awayTeam': match.match_awayteam_name,
          'matchDate': match.match_date,
          'matchTime': match.match_time,
          'bettings': []
        };
        this.upcommingMatches.push(bettingMatch);

       let betting = {offer: "s", dealer: "s", rate: 0, amount: 1, status: 1};
      // bettingMatch.bettings.push(betting);
        this.solobetService.loadBettings(this.web3Service.toSHA3(mHash))
          .subscribe(bettings => {

            bettingMatch.bettings.push(betting);
            if(bettingMatch.bettings.length > 0) {
              console.log(this.upcommingMatches);
            }


          }, e => {
            console.log(e);
          });
      }
    });

  };

  onReady = () => {
    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() => {
          this.initMatches();
        }
      );
    }, err => alert(err));
  };

  loadMatches = () => {

    this.solobetService.loadMatches('0x123')
      .subscribe(match => {
        this.match = match;
      }, e => {
        console.log(e);
      });
  };

  loadBettings = (matchid) => {
    this.solobetService.loadBettings(matchid)
      .subscribe(bettings => {
        this.bettings = bettings;
      }, e => {
        console.log(e);
      });
  };

  deal = (matchId, bettingId) => {
    this.solobetService.deal(this.account, matchId, 0)
      .subscribe(result => {
        this.loadBettings(matchId);
      }, e => {
        console.log(e);
        alert(e);
      });

  };

  offer = (match) => {
    this.solobetService.newOffer(this.account, match, 200,75, 3)
      .subscribe(result => {
        alert(result);
      }, e => {
        console.log(e);
        alert(e);
      });
  };

}
