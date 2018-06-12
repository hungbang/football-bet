import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Fixture } from "../../models/fixture";
import {
  Web3Service,
  SolobetService,
  MatchService,
  JhelperService
} from "../../service/service";
import { Handicap } from "models/handicap";
import { Match } from "models/match";

@Component({
  selector: "app-match-detail",
  templateUrl: "./match-detail.component.html",
  styleUrls: ["./match-detail.component.css"]
})
export class MatchDetailComponent implements OnInit {
  public fixture: Fixture = new Fixture();
  public handicap: Handicap = new Handicap();
  public match: Match = new Match();
  public oddsArray: any[] = [
    { id: "000", value: "0:0" },
    { id: "025", value: "0:1/4" },
    { id: "050", value: "0:1/2" },
    { id: "075", value: "0:3/4" },
    { id: "100", value: "0:1" },
    { id: "125", value: "0:1 1/4" },
    { id: "150", value: "0:1 1/2" },
    { id: "175", value: "0:1 3/4" },
    { id: "200", value: "0:2" }
  ];


  public account: any;
  public accounts: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _web3Service: Web3Service,
    private _solobetService: SolobetService,
    private _matchService: MatchService,
    private _helper: JhelperService
  ) {}

  ngOnInit() {
    let _pairs: any[]=[];
    this._getAccounts();
    this._route.queryParams.subscribe(p => {
      if (p.id) {
        this._setProperties(p);
      } else {
        this._router.navigate([""]);
      }
    });
  }

  private _setProperties(p: any) {
    this.handicap.id = p.id.toString();

    let _pairs: any[] = [
      {id:"1",value:p.homeTeamName + "-" + p.awayTeamName},
      {id:"2",value:p.awayTeamName + "-" + p.homeTeamName}    ];
    this.handicap.pairs = _pairs;
    console.log(this.handicap.pairs)
    this.handicap.date = p.date;

    this.fixture.id = p.id.toString();
    this.fixture.awayFlag = p.awayFlag;
    this.fixture.awayTeamId = p.awayTeamId;
    this.fixture.awayTeamName = p.awayTeamName;
    this.fixture.competitionId = p.competitionId;
    this.fixture.date = p.date;
    this.fixture.homeFlag = p.homeFlag;
    this.fixture.homeTeamId = p.homeTeamId;
    this.fixture.homeTeamName = p.homeTeamName;
    this.fixture.status = p.status;

    let time = new Date(p.date);
    this.match.matchId = p.id.toString();
    this.match.homeTeam = p.homeTeamName;
    this.match.awayTeam = p.awayTeamName;
    this.match.homeGoals = p.homeGoals;
    this.match.awayGoals = p.awayGoals;
    this.match.time = time.getTime();
    this.match.status = 0;
  }

  private _getAccounts() {
    this._web3Service.getAccounts().subscribe(
      accs => {
        this.accounts = accs;
        this.account = this.accounts[0];

        // This is run from window:load and ZoneJS is not aware of it we
        // need to use _ngZone.run() so that the UI updates on promise resolution
      },
      err => alert(err)
    );
  }

  public loadBettings(match) {
    this._solobetService.loadBettings(match.id).subscribe(
      bettings => {
        match.bettings = bettings;
      },
      e => {
        console.log(e);
      }
    );
  }

  public offer(handicap: Handicap) {
    console.log(handicap);
    // this._prepareMatches(handicap);

    this._solobetService
      .newOffer(this.account, this.match, +handicap.odds, handicap.stake)
      .subscribe(
        result => {
          console.log("====begin loadBettings=====");
          this.loadBettings(this.match);
          console.log("====end loadBettings=====");
        },

        e => {
          console.error("Invalid number of arguments to Solidity function", e);
        }
      );
  }

  private _prepareMatches(handicap) {
    this.match.matchId = handicap.id;
    this.match.homeTeam = this.fixture.homeTeamName;
    this.match.awayTeam = this.fixture.awayTeamName;
    let time = new Date(handicap.date);
    console.log(time.getTime());
    this.match.time = time.getTime();
    console.log(this.match);
    console.log(handicap);
  }
}
