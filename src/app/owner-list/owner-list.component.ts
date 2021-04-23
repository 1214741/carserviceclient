import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../shared/owner/owner.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../shared/car/car.service';


@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners: Array<any>;
  selected: Array<any> = [] ;

  constructor(private route: ActivatedRoute,
             private router: Router, 
             private ownerService: OwnerService, 
             private giphyService: GiphyService,
             private carService: CarService) { }

  ngOnInit() {
    this.ownerService.getAll().subscribe(data => {
      this.owners = data._embedded.owners;
      console.log(this.owners);
      for (const owner of this.owners) {
        this.giphyService.get(owner.name).subscribe(url => owner.giphyUrl = url);
      }
    });
  }

  gotoList() {
    this.router.navigate(['/owner-list']);
  }

  selectedItem(owner: any) {
    this.selected = owner;
    console.log(this.selected);
    this.gotoList();
  }

  remove() {
    for (const owner of this.selected) {
      this.ownerService.removeOwner(owner._links.self.href).subscribe(result => {
        const ownerDni = owner.dni;
        this.carService.getAll().subscribe((cars) => {
          for (const car of cars) {
            if (car.ownerDni === ownerDni) {
              car.ownerDni = null;
              this.carService.save(car).subscribe(() => {
              });
            }
          }
        });
        this.ngOnInit();
      }, error => console.error(error));
    }
  }
}
