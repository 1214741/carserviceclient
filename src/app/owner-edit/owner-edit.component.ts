import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../shared/owner/owner.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit {

  sub: Subscription;
  owner: any = {};

  constructor(private route: ActivatedRoute,
    private router: Router,
    private ownerService: OwnerService,
    private giphyService: GiphyService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      console.log(params)
      if (id) {
        this.ownerService.getDni(id).subscribe(data => {
          if (data._embedded.owners[0]) {
            this.owner = data._embedded.owners[0];
            this.owner.href = this.owner._links.self.href;
            console.log(this.owner);
          } else {
            console.log("No existe el Owner con el dni ingresado");
            this.gotoList();
          }
        }, err => {
          console.log("No se puede conectar con el API");
          this.gotoList();
        })
      } 
    });

  }

  gotoList() {
    this.router.navigate(['/owner-list']);
  }

  save(form: NgForm) {
    this.ownerService.saveOwner(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

}
