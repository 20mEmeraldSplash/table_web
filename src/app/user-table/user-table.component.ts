import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sort } from '@angular/material/sort';

export interface Users {
  id: number;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {
  allItems: Users[] = [];
  currentItems: any[] = [];
  pageSize = 10;
  currentPage = 1;
  pageNumbers: number[] = [];
  sortedItems: Users[];

  ngOnInit(): void {
    this.http.get<any[]>('./assets/MOCK_DATA.json').subscribe((data) => {
      this.allItems = data;
      this.sortedItems = this.allItems;
      this.paginateItems();
    });
  }

  constructor(private http: HttpClient) {
    this.sortedItems = this.allItems.slice();
  }
  paginateItems() {
    const totalPages = Math.ceil(this.allItems.length / this.pageSize);
    this.pageNumbers = Array(totalPages)
      .fill(0)
      .map((x, i) => i + 1);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.currentItems = this.allItems.slice(startIndex, endIndex);
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.paginateItems();
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateItems();
    }
  }

  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.paginateItems();
  }

  goToNextPage() {
    if (this.currentPage < this.pageNumbers.length) {
      this.currentPage++;
      this.paginateItems();
    }
  }

  goToLastPage() {
    this.currentPage = this.pageNumbers.length;
    this.paginateItems();
  }

  sortData(event: Sort) {
    const data = this.allItems.slice();
    if (!event.active || event.direction === '') {
      this.sortedItems = data;
      return;
    }

    this.sortedItems = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      switch (event.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'email':
          return compare(a.email, b.email, isAsc);
        case 'phone':
          return compare(a.phone, b.phone, isAsc);
        default:
          return 0;
      }
    });
    this.currentItems = this.sortedItems.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
