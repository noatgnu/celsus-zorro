import { Component, OnInit } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {FormBuilder, Validators} from "@angular/forms";
import {AccountsService} from "../accounts.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  orcid = environment.orcid

  form = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  })
  constructor(private fb: FormBuilder, private accounts: AccountsService) { }

  ngOnInit(): void {
  }

  submit() {
    if (this.form.valid) {
      this.accounts.login(this.form.value["username"], this.form.value["password"]).subscribe((data: any) => {
        this.processLogin(data)
      })
    }
  }

  processLogin(data: any) {
    this.accounts.accessToken = data.access
    this.accounts.refreshToken = data.refresh
    this.accounts.loggedIn = true
    this.accounts.lastTokenUpdateTime = new Date()
    this.accounts.lastRefreshTokenUpdateTime = new Date()
    this.accounts.getUserData().subscribe((data: any) => {
      this.accounts.user_id = data.id
      this.accounts.user_name = data.username
      this.accounts.user_staff = data.is_staff
      this.form.reset()
      window.location.assign(window.location.origin)
    }, error =>{

    })
  }
}
