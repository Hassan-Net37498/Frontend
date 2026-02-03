import { Component ,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard-service';
import { DashboardStats } from '../../models/DashboardStats';
import { WeeklyEarnings } from '../../models/weeklyearn';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { UsersList } from '../users-list/users-list';



@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule, BaseChartDirective,RouterOutlet],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.sass',
})
export class DashboardComponent implements OnInit {
  
 currentUser: any;
  stats: DashboardStats = { totalUsers: 0, activeUsers: 0, blockedUsers: 0 }; // default 0 values
  data:any[]=[];
 usersCount: any;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router
    
  ) {}

  ngOnInit(): void {
   this.fetchUsersCount();
    this.currentUser = this.authService.currentUserValue || { fullName: 'Guest', email: '' };
    this.dashboardService.getStats().subscribe({
      next: (res) =>{ this.stats = res.data
         console.log("data is ", res.data)
      },
      error: (err) => console.error(err)
    });
    

    
  }
  fetchUsersCount(): void {
  this.dashboardService.getUsersCount().subscribe({
    next: (count: number) => {
      this.usersCount = count;
      console.log("coutnts " ,count);
      console.log("hassan data ",this.usersCount);
    },
    error: (err) => {
      console.error('Error fetching users count', err);
    }
  });
}


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
 user(): void {
    this.router.navigate(['/users']);
  }
comission():void{
   
  this.router.navigate(['/comission']);
}  
withdraw(){
  this.router.navigate(['withdraw']);
}
}

