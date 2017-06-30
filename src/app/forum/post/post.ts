import { Component } from "@angular/core";
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as firebase from 'firebase';

import { PostEditForm } from './modal/post.edit.form';

import {
  UserService,
  CATEGORY, CATEGORIES,
  POST, POSTS,
  ForumService,
  ApiService, TestService
} from '../../../firebase-backend/firebase-backend.module';

import { SharedService } from './../../provider/shared.service';

@Component({
    selector: 'app-post',
    templateUrl: './post.html',
    styleUrls: ['./post.css']
})

export class PostComponent {

    categories: CATEGORIES = [];    
    post_error: string;
    postError = {
        message: '' 
    }

    action: string = "list";
    btnSubmit: boolean = true;

    postForm: POST = {
        uid: '',
        name: '',
        categories: <any>{},
        subject: '',
        content: '',
        photoUrl: ''
    };

    posts: POSTS;

    private allItems: any[];
 
    pager: any = {};
    pagedItems: any[];
    pageSize: number;
    nooflist: number = 5;
    form: FormGroup;

    modalRef = null;

    constructor(
        public forum: ForumService, 
        private api: ApiService, 
        public user: UserService, 
        private shared: SharedService,
        private fb: FormBuilder,
        private modalService: NgbModal
    ) {

        this.formLoad();
        
        api.setBackendUrl( 'https://us-central1-forum-test-9f0a8.cloudfunctions.net/postApi' );
        this.loadPosts();

    }

    formLoad() {
        
        /**
         *  Initialized the Form 
         */

        this.form = this.fb.group({
            subject: [],
            content: [],
            categories: [[]]
        });
        
        /**
         *  Initialized the Categories 
         */

        this.listenCategory();
    }

    /**
     *  Initialized the Posts 
     */

    loadPosts() {
        this.posts = [];
        this.forum.postData().once('value').then( s => {
            let obj = s.val();
            for( let k of Object.keys( obj ) ) {
                let newDate = new Date( obj[k].stamp * 1000 );
                let dpublish = this.getMonths(newDate.getMonth()) +' '+ newDate.getDate() +', '+ newDate.getFullYear();
                    if(obj[k].stamp) {
                        obj[k].stamp = dpublish
                    }
                this.posts.unshift( obj[k] );
            }
        this.setPage(1);
        });
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        
        this.pager = this.shared.getPager(this.posts.length, page, this.nooflist);
        this.pagedItems = this.posts.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    onChangeFormCategory($event) {
        console.log($event);
        let checked = $event.target.checked;
        let value = $event.target.value;
        let categoryArray = this.form.get('categories').value;
        if (checked) { // add
            categoryArray.push(value);
        }
        else { // remove
            categoryArray = categoryArray.filter(v => v !== value)
        }
        this.form.get('categories').setValue(categoryArray);
    }

    onSubmitPostForm() {
        if(this.form.value.subject == "") {
            return this.postError.message = "Subject is missing";
        }
  
        this.form.value.uid = this.user.uid;
        this.form.value.name = this.user.name;
        this.form.value.function = 'create';
        
        this.postForm = this.form.value;
        this.api.post( this.postForm ).subscribe( key => {
        
        this.loadPosts();
        this.formLoad();

        }, e => {
            this.postError.message = "Category is empty";
        });
    }

    onClickEdit( post : POST ) {
        console.log(post);
        this.modalRef = this.modalService
        .open( PostEditForm );
        this.modalRef.componentInstance['option'] = post;

        this.modalRef.result.then(( res ) => {
           this.loadPosts();
        }, reason => {
            console.log(reason)
        });
    }

    onClickDelete( post : POST ) {
        let data = {
            uid: post.uid,
            key: post.key,
            function: 'delete'
        }
        this.api.post( data ).subscribe( key => {
        
        this.loadPosts();

        }, e => { console.log(e.message); });
    }

    /*
    *   List all categories to load on the form
    *
    *
    */

    listenCategory() {
        this.forum.observeCategory().subscribe(res => {
            this.categories = res;
        });
    }

    /*
    *   File Upload Function
    *
    *   Todo - Categorize the uploaded image to the storage
    *
    */

    onChangeFileUpload( fileInput ) {
        this.btnSubmit = false;
        let file = fileInput.files[0];

        let storageRef = firebase.storage().ref();
        let path = `/uploads/${this.user.uid}/${file.name}`;
        let iRef = storageRef.child(path);

        iRef.put(file).then((snapshot) => {
            this.btnSubmit = true;
            this.postForm.photoUrl = snapshot.downloadURL;
        });
    }

    /*
    *   Convert Timestamp into Real Time
    *
    */

    getMonths(month) {
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return months[month];
    }
}