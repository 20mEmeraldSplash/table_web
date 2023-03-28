import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {
  constructor(private http: HttpClient) {}

  allItems: any[] = [];
  currentItems: any[] = [];
  pageSize = 10;
  currentPage = 1;
  pageNumbers: number[] = [];

  ngOnInit(): void {
    this.http.get<any[]>('./assets/MOCK_DATA.json').subscribe((data) => {
      this.allItems = data;
      this.paginateItems();
    });
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
}
