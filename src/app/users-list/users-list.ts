import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user-service';
import { User } from '../../models/User';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Editcomponent } from '../editcomponent/editcomponent';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUser } from '../../models/UpdateUser';
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.sass']
})
export class UsersList implements OnInit {
  users: User[] = [];
  userss: any[] = [];
  loading = false;
  error = '';
  active:any;
  blocked:any;

  showAddModal = false;
  userForm!: FormGroup; // Reactive form

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Filters
  searchTerm = '';
  filterStatus: string = 'all';

  constructor(private userService: UserService,private dialog: MatDialog, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.fetchUsers();
  }

  /** Initialize reactive form */
  initForm(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: [''],
      country: ['']
    });
  }
   editUser(user: User) {
    const dialogRef = this.dialog.open(Editcomponent, {
      width: '700px',
      data: { ...user }, // send a copy
    });

    dialogRef.afterClosed().subscribe((result: any | null) => {
      if (result) {
        // Call backend to update user
        this.userService.updateUser(user.id, user).subscribe((res) => {
          if (res.success) {
            // Update local array
            const index = this.users.findIndex((u) => u.id === user.id);
            if (index !== -1) this.users[index] = res.data!;
            alert(res.message);
          } else {
            alert(res.message || 'Failed to update user');
          }
        });
      }
    });
  }

  /** Fetch all users for stats/cards */
  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res: any) => {this.userss = res;
        console.log("users is ",res);
       console.log("b",this.userss.filter(a=> !a.isBlocked).length)
       this.active=this.userss.filter(a=> !a.isBlocked).length;
       this.blocked=this.userss.filter(a=>a.isBlocked).length;

      },
      error: (err) => console.error('Error fetching users', err)
    });
  }

  /** Load paginated users */
  loadUsers(): void {
    this.loading = true;
    this.error = '';

    const isBlocked = this.filterStatus === 'all' ? undefined : this.filterStatus === 'blocked';

    this.userService.getUsers(this.currentPage, this.pageSize, this.searchTerm || undefined, isBlocked)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.users = response.data.items;
            this.totalItems = response.data.totalItems;
            this.totalPages = response.data.totalPages;
            this.currentPage = response.data.currentPage;
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load users';
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  /** Modal logic */
  openAddModal(): void {
    this.showAddModal = true;
    this.userForm.reset();
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  /** Add user using reactive form */
  addUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.fetchUsers();
        this.loadUsers();
        this.closeAddModal();
      },
      
    });
  }

  /** Utilities */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }
   deleteUser(userId: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userService.deleteUser(userId).subscribe({
      next: (res) => {
        if (res.success) {
          // Remove the deleted user from the list
          this.users = this.users.filter(u => u.id !== userId);
          alert(res.message); // or show a toast
          this.fetchUsers()
        } else {
          alert(res.message || 'Failed to delete user');
        }
      },
      error: (err) => {
        console.error('Delete error:', err);
        alert('An error occurred while deleting the user');
      }
    });
  }
  toggleBlock(user: User) {
    this.userService.toggleBlockStatus(user.id).subscribe({
      next: res => {
        // Update the user in the array locally
        user.isBlocked = !user.isBlocked;
        alert(`User ${user.fullName} is now ${user.isBlocked ? 'Blocked' : 'Unblocked'}`);
      },
      error: err => {
        console.error('Error toggling block status', err);
      }
    });
  }
}
