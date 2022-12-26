import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AccountsService} from "./pages/accounts/accounts.service";
import {WebService} from "./services/web.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  isCollapsed = false;
  initialLoginProcess: boolean = false;
  form = this.fb.group({
    query: [null,],
  })
  constructor(private web: WebService, private fb: FormBuilder, public accounts: AccountsService) {
    const path = document.URL.replace(window.location.origin+"/", "")
    if (path.startsWith("?code=")) {
      const code = path.split("=")
      this.accounts.ORCIDLogin(code[1])
    } else {
      this.accounts.reload()
    }

    this.initialLoginProcess = true
  }

  navigateQuery() {
    window.location.href = "/#/project-explorer/search/"+this.form.value["query"]
  }

  logout() {
    this.accounts.logout().subscribe(data => {

    })
  }

  testInit() {
    if (this.accounts.accessToken === "" && this.accounts.refreshToken === "") {
      this.accounts.login("admin", "alessilab") //testbranch
        .subscribe((data: any) => {
          this.accounts.accessToken = data.access
          this.accounts.refreshToken = data.refresh
          this.accounts.loggedIn = true
          this.accounts.lastTokenUpdateTime = new Date()
          this.accounts.lastRefreshTokenUpdateTime = new Date()
          this.web.getUserData().subscribe((data: any) => {
            this.accounts.user_id = data.id
            this.accounts.user_name = data.username
            this.accounts.user_staff = data.is_staff
          })
          this.initialLoginProcess = true
        })
    } else {
      this.accounts.loggedIn = true
      this.initialLoginProcess = true
    }
  }
}
