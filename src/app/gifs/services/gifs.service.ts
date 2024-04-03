import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_APIKEY = 'API-KEY';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = []
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';
  private _tagsHistory: string[] = [];

  constructor(private http: HttpClient) { }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag)
    }
    this._tagsHistory.unshift(tag)
    this._tagsHistory = this._tagsHistory.splice(0,20);
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);
    console.log(this._tagsHistory);
    const params = new HttpParams()
      .set('api_key', GIPHY_APIKEY)
      .set('q', tag)
      .set('limit', '20');
    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
      .subscribe( resp => {
        this.gifList = resp.data;
        console.log(this.gifList)
      });
  }
}
