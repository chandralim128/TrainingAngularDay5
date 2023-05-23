import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { map} from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  error = null;
  errorSub: Subscription;
  updateTitle: string;
  updateId: string;
  updateContent: string;
  showLoading = false;
  constructor(private postService: PostService) {
  }
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  ngOnInit() {
    this.errorSub = this.postService.errorHandling.subscribe(
      (error) => {
        this.error = error;
      }
    );
    this.onFetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.postService.createAndPost(postData);
  }

  onUpdatePost(updatedData: Post){
    this.postService.update(updatedData);
  }

  writeUpdate(post: Post){
    this.updateId = post.id;
    this.updateTitle= post.title;
    this.updateContent = post.content;
  }
  onFetchPosts() {
    // Send Http request
    this.showLoading = true;
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.showLoading = false;
        this.loadedPosts = posts;
      },
      error => {
        console.log(error);
        this.postService.errorHandling.next(error);
      }
    );
  }

  onClearPosts() {
    this.showLoading = true;
    this.postService.deletePosts().subscribe(
      (data) => {
        this.showLoading = false;
        this.loadedPosts = [];
      }
    )
    // Send Http request

  }

  
}
