import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
    id: number;
    name: string;
    price: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductsResponse {
    data: Product[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/products';

    getProducts(page: number = 1, limit: number = 10): Observable<ProductsResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<ProductsResponse>(this.apiUrl, { params });
    }

    createProduct(product: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    uploadExcel(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>('http://localhost:3000/upload-excel', formData);
    }
}
