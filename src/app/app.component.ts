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

  }
}
