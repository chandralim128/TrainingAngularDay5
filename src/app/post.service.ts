import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  endPointURL: string = 'https://angularday5-fdb0c-default-rtdb.asia-southeast1.firebasedatabase.app/'
  postURL: string = this.endPointURL+'post.json';
  errorHandling = new Subject<any>();
  constructor(private http: HttpClient) { }

  createAndPost(postData: Post){
    this.http.post<{name: string}>(this.postURL, postData, {
      observe: 'response',
      responseType: 'json'
    }).subscribe(
      (data) => {
        console.log(data);
        this.errorHandling.next(null);
      },
      (error) =>{
        this.errorHandling.next(error);
      }
    );
  }
  fetchPosts(){
    let customParam = new HttpParams();
    customParam = customParam.append('print', 'pretty');
    customParam = customParam.append('custom-param', 'custom-param-value');
    return this.http.get<{[key: string] : Post}>(this.postURL,{
      headers: new HttpHeaders({
        'custom-header' : 'he llooo custom header'
      }),
      params: customParam,
    })
    .pipe(
      map( responseData =>{
        const postArray: Post[] = [];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({...responseData[key], id: key})
          }
        }
        return postArray;
      })
    );
  }
  update(updatedData: Post){
    console.log(updatedData);
    const data = { [updatedData.id] : {
      title: updatedData.title,
      content: updatedData.content
    }}
    return this.http.patch(this.postURL,data).subscribe(
      (response) =>{
        console.log(response);
        this.fetchPosts();
      },
      error => {
        console.log(error)
      }
    )
  }
  deletePosts(){
    return this.http.delete(this.postURL,{
      observe: 'events'
    }).pipe(
      tap(
        event => {
          console.log(event);
          if(event.type === HttpEventType.Sent){
          }
          if(event.type === HttpEventType.Response){
            console.log(event.body)
          }
        }
      )
    );
  }
}
