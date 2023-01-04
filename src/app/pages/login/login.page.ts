import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string
  password: string

  constructor(private route: Router, private httpClient: HttpClient) {}

  ngOnInit() {}

  async login() {
    const loginData = {
      usernameEmail: this.email,
      password: this.password,
    }
    if (this.email && this.password) {
      this.httpClient
        .post('https://logmaster-auth.herokuapp.com/auth/signin', loginData)
        .subscribe(
          (res) => {
            console.log('login state', res)
            localStorage.setItem('token', (res as any).data.accessToken)
            localStorage.setItem('userId', (res as any).data.user._id)
            this.route.navigate(['/generate-pdf'])
          },
          (error) => {
            console.log('Response error----->', error['message'])
          },
        )
    }
  }
}
