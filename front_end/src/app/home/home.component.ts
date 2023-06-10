import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  isAuthenticated: boolean;
  dataSource!: any;
  data!: any;
  public lineChartData: any[] = [];
  public lineChartLabels: string[] = [];
  public lineChartOptions: any = {
    responsive: true,
  };
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private apiservice: ApiService
  ) {
    this.isAuthenticated = authService.isAuthenticatedUser();
  }
  ngOnInit() {
    if (this.authService.isAuthenticatedUser()) {
      this.router.navigate(['/home']);
    }
    this.getData();
    // this.getDataChart();
  }
  getData(): any {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      api_key: 'asala-task',
      Authorization: this.authService.token(),
    });
    this.http
      .get(this.apiservice.apiUrl + `/index`, { headers })
      .subscribe((response: any) => {
        this.data = response.data;
      });
  }

  // getDataChart() {
  //   const headers = new HttpHeaders({
  //     Accept: 'application/json',
  //     'Content-Type': 'application/json',
  //     api_key: 'asala-task',
  //     Authorization: this.authService.token(),
  //   });
  //   this.http
  //     .get<any[]>(this.apiservice.apiUrl + '/products', { headers })
  //     .subscribe((data: any) => {
  //       // console.log(data)
  //       const productData = data.map((product: any) => product.created_at);
  //       const productCountByDate = this.countByDate(productData);
  //       this.lineChartData = [
  //         { data: Object.values(productCountByDate), label: 'Products' },
  //       ];
  //       this.lineChartLabels = Object.keys(productCountByDate);
  //       console.log(Object.keys(productCountByDate))
  //     });
  // }

  // countByDate(data: string[]): { [date: string]: number } {
  //   const countByDate: { [date: string]: number } = {};

  //   data.forEach((date) => {
  //     if (countByDate[date]) {
  //       countByDate[date] += 1;
  //     } else {
  //       countByDate[date] = 1;
  //     }
  //   });

  //   return countByDate;
  // }
}
