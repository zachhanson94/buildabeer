import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMiscellaneous } from '../miscellaneous';
import { MiscellaneousService } from '../miscellaneous.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../user/auth.service';

@Component({
  selector: 'app-miscellaneous-new',
  templateUrl: './miscellaneous-new.component.html',
  styleUrls: ['./miscellaneous-new.component.scss'],
  outputs: ['onMiscellaneousCreate']
})
export class MiscellaneousNewComponent implements OnInit {

  errorMessage: string = "Loading..."

  @Input()
  originalMiscellaneousItem: IMiscellaneous;

  newMiscellaneousItem: IMiscellaneous;

  @Output()
  onMiscellaneousCreate = new EventEmitter();

  newModal: NgbModalRef;

  misc_types: string[] = ["Spice", "Fining", "Herb", "Flavor", "Other"]
  misc_usages: string[] = ["Boil", "Mash", "Primary", "Secondary", "Bottling"]

  misc_time_label: number = 1;

  constructor(private _router: Router, private _miscellaneousService:
    MiscellaneousService, private _activatedRoute: ActivatedRoute,
    private _modalService: NgbModal, public _authService: AuthService) { }

  ngOnInit() { }

  newSubmit(form: any): void {
    this.newMiscellaneousItem.time = this.newMiscellaneousItem.time * this.misc_time_label;
    this._miscellaneousService.createMiscellaneous(this.newMiscellaneousItem)
      .subscribe((res) => {
        this.newMiscellaneousItem.id = JSON.parse(res._body).id;
        this.newMiscellaneousItem.user_id = JSON.parse(res._body).user_id;
        this.onMiscellaneousCreate.emit({miscellaneous: this.newMiscellaneousItem});
        this.newModal.close();
      }, (error) => {
        if (error.status == "401") {
          window.alert("You must log in first.");
        } else {
          window.alert("There was an error processing your request, please try again later.");
        }
        console.error(error);
      });
  }

  open(newMiscellaneous) {
    this.newMiscellaneousItem = Object.assign({}, this.originalMiscellaneousItem)
    this.newModal = this._modalService.open(newMiscellaneous, { size: 'lg' });
  }
}
