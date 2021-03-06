import { HandicapInterface } from "interfaces/handicap";
import { DateTime } from "luxon";

import { ODDS_TYPE, PAIR_TYPE } from "enums/handicap";
import { parseIntAutoRadix } from "@angular/common/src/i18n/format_number";

export class Handicap {
  public static readonly oddsArray: Array<Object> = [
    { id: "000", value: ODDS_TYPE.ZERO },
    { id: "025", value: ODDS_TYPE.QUARTER },
    { id: "050", value: ODDS_TYPE.HALF },
    { id: "075", value: ODDS_TYPE.THREE_FOURTHS },
    { id: "100", value: ODDS_TYPE.ONE },
    { id: "125", value: ODDS_TYPE.ONE_QUARTER },
    { id: "150", value: ODDS_TYPE.ONE_HALF },
    { id: "175", value: ODDS_TYPE.ONE_THREE_FOURTHS },
    { id: "200", value: ODDS_TYPE.TWO }
  ];

  private _id: number | string;
  public get id(): number | string {
    return this._id;
  }
  public set id(v: number | string) {
    this._id = v;
  }

  private _homeTeamName: string;
  public get homeTeamName(): string {
    return this._homeTeamName;
  }
  public set homeTeamName(v: string) {
    this._homeTeamName = v;
  }

  private _awayTeamName: string;
  public get awayTeamName(): string {
    return this._awayTeamName;
  }
  public set awayTeamName(v: string) {
    this._awayTeamName = v;
  }

  public get pairTeam(): string {
    return `${this.homeTeamName} - ${this.awayTeamName}`;
  }
  public get inversePairTeam(): string {
    return `${this.awayTeamName} - ${this.homeTeamName}`;
  }

  private _odds: string | number;
  public get odds(): string | number {
    return this._odds || Handicap.oddsArray[1]["id"]
  }
  public set odds(v: string | number) {
    this._odds = v;
  }

  public get odds_number(): number{
    if (
      (this.selectedPair === "1" && this._selectedTeam === "0") ||
      (this.selectedPair === "2" && this._selectedTeam === "1")
    ) {
      return (0 - parseInt(this.odds.toString()));
    } else if (
      (this.selectedPair === "1" && this._selectedTeam === "1") ||
      (this.selectedPair === "2" && this._selectedTeam === "0")
    ) {
      return parseInt(this.odds.toString());
    }

}
  private _stake: number;
  public get stake(): number {
    return this._stake || 5;
  }
  public set stake(v: number) {
    this._stake = v;
  }

  private _date: string;
  public get date(): string {
    return this._date;
  }
  public set date(v: string) {
    this._date = v;
  }

  public get date_string(): string {
    return DateTime.fromISO(this._date).toFormat("f");
  }

  private _selectedPair: string;
  public get selectedPair(): string {
    return this._selectedPair || PAIR_TYPE.REVERT;
  }
  public set selectedPair(v: string) {
    this._selectedPair = v;
  }

  private _selectedTeam: string;
  public get selectedTeam(): string {
    return this._selectedTeam;
  }
  public set selectedTeam(v: string) {
    this._selectedTeam = v;
  }

  public get teams(): string[] {
    return [this._homeTeamName, this._awayTeamName];
  }

  constructor(data?: HandicapInterface) {
    if (data) {
      this.id = data.id;
      this.odds = data.odds;
      this.stake = data.stake;
      this.date = data.date;
      this.selectedPair = data.selectedPair;
      this.homeTeamName = data.homeTeamName;
      this.awayTeamName = data.awayTeamName;
      this.selectedTeam = data.selectedTeam;
    }
  }
}
