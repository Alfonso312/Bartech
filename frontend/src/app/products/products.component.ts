import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, Product, ProductsResponse } from '../services/products.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-layout">
      <!-- Navbar -->
      <nav class="glass-navbar">
        <div class="nav-brand">Bartech Dashboard</div>
        <div class="nav-actions">
          <span class="user-greeting">Welcome back</span>
          <button (click)="logout()" class="logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Logout
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="dashboard-content">
        <header class="page-header">
          <div>
            <h1>Products Inventory</h1>
            <p>Manage your store catalog</p>
          </div>
          <div class="header-actions">
            <!-- Hidden File Input -->
            <input 
              type="file" 
              #fileInput 
              accept=".xlsx,.xls,.csv" 
              style="display: none" 
              (change)="onFileSelected($event)"
            />
            
            <button class="glass-button secondary-btn" (click)="fileInput.click()" [disabled]="isUploadingExcel">
              <svg *ngIf="!isUploadingExcel" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem; vertical-align: middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              {{ isUploadingExcel ? 'Uploading...' : 'Upload Excel' }}
            </button>
            <button class="glass-button add-btn">+ Add Product</button>
          </div>
        </header>

        <!-- Notification Banner -->
        <div *ngIf="uploadMessage" class="notification-banner" [ngClass]="{'success': isUploadSuccess, 'error': !isUploadSuccess}">
          {{ uploadMessage }}
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="grid-container">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="glass-card skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text small"></div>
          </div>
        </div>

        <!-- Products Grid -->
        <div *ngIf="!isLoading && products.length > 0" class="grid-container">
          <div *ngFor="let product of products" class="glass-card product-card">
            <div class="product-price">\${{ product.price | number:'1.2-2' }}</div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p>ID: #{{ product.id }}</p>
              <div class="product-actions">
                <button class="action-btn edit">Edit</button>
                <button (click)="deleteProduct(product.id)" class="action-btn delete">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && products.length === 0" class="empty-state glass-card">
          <div class="empty-icon">📦</div>
          <h3>No products found</h3>
          <p>Get started by adding your first product to the inventory.</p>
        </div>

        <!-- Pagination -->
        <div *ngIf="!isLoading && totalPages > 1" class="pagination-bar glass-card">
          <button 
            [disabled]="currentPage === 1" 
            (click)="changePage(currentPage - 1)"
            class="page-btn">
            Prev
          </button>
          
          <div class="page-info">
            Page <span class="highlight">{{ currentPage }}</span> of {{ totalPages }}
          </div>

          <button 
            [disabled]="currentPage === totalPages" 
            (click)="changePage(currentPage + 1)"
            class="page-btn">
            Next
          </button>
        </div>
      </main>
    </div>
  `,
    styles: [`
    .dashboard-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .glass-navbar {
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-brand {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(to right, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .user-greeting {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-main);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
      border-color: rgba(239, 68, 68, 0.2);
    }

    .dashboard-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      flex: 1;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
      animation: fadeIn 0.5s ease-out;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .page-header p {
      color: var(--text-muted);
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .add-btn {
      width: auto;
      padding: 0.75rem 1.5rem;
    }

    .secondary-btn {
      width: auto;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      color: var(--text-main);
    }

    .secondary-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }

    .notification-banner {
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 2rem;
      text-align: center;
      animation: fadeIn 0.3s ease-out;
    }

    .notification-banner.success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .notification-banner.error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    /* Grid Layout */
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .product-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      animation: fadeInUp 0.5s ease-out backwards;
    }

    .grid-container > div:nth-child(1) { animation-delay: 0.1s; }
    .grid-container > div:nth-child(2) { animation-delay: 0.15s; }
    .grid-container > div:nth-child(3) { animation-delay: 0.2s; }
    .grid-container > div:nth-child(4) { animation-delay: 0.25s; }
    
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.3);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .product-price {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
      padding: 2.5rem 1.5rem;
      font-size: 2.5rem;
      font-weight: 800;
      text-align: center;
      color: var(--text-main);
      border-bottom: 1px solid var(--glass-border);
    }

    .product-info {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-info h3 {
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }

    .product-info p {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .product-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
    }

    .action-btn {
      flex: 1;
      padding: 0.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn.edit {
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-main);
    }

    .action-btn.edit:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .action-btn.delete {
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: var(--error);
    }

    .action-btn.delete:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    /* Skeleton Loading */
    .skeleton-card {
      padding: 0;
      height: 250px;
    }

    .skeleton-img {
      height: 120px;
      background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    .skeleton-text {
      height: 20px;
      margin: 1.5rem;
      border-radius: 4px;
      background: rgba(255,255,255,0.05);
      animation: loading 1.5s infinite;
    }

    .skeleton-text.small {
      width: 50%;
      height: 15px;
      margin-top: 0;
    }

    /* Empty State */
    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    /* Pagination */
    .pagination-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
    }

    .page-btn {
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-main);
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }

    .page-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .highlight {
      color: var(--primary);
      font-weight: 700;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class ProductsComponent implements OnInit {
    private productsService = inject(ProductsService);
    private authService = inject(AuthService);
    private router = inject(Router);

    products: Product[] = [];
    isLoading = true;
    currentPage = 1;
    totalPages = 1;

    // Upload states
    isUploadingExcel = false;
    uploadMessage = '';
    isUploadSuccess = false;

    ngOnInit() {
        this.loadProducts(this.currentPage);
    }

    loadProducts(page: number) {
        this.isLoading = true;
        this.productsService.getProducts(page).subscribe({
            next: (response: ProductsResponse) => {
                this.products = response.data;
                this.totalPages = response.totalPages || 1;
                this.currentPage = response.currentPage || 1;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load products', err);
                // If unauthenticated, redirect to login
                if (err.status === 401) {
                    this.logout();
                }
                this.isLoading = false;
            }
        });
    }

    changePage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
            this.loadProducts(page);
        }
    }

    deleteProduct(id: number) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.productsService.deleteProduct(id).subscribe({
                next: () => {
                    this.loadProducts(this.currentPage);
                },
                error: (err) => {
                    console.error('Failed to delete', err);
                }
            });
        }
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        
        if (file) {
            this.isUploadingExcel = true;
            this.uploadMessage = '';
            
            this.productsService.uploadExcel(file).subscribe({
                next: (response) => {
                    this.isUploadingExcel = false;
                    this.isUploadSuccess = true;
                    this.uploadMessage = `Excel submitted successfully. ${response.batchesCreated} batches are being processed in the background.`;
                    
                    // Clear the message after 5 seconds
                    setTimeout(() => {
                        this.uploadMessage = '';
                    }, 5000);
                },
                error: (err) => {
                    this.isUploadingExcel = false;
                    this.isUploadSuccess = false;
                    this.uploadMessage = err.error?.message || 'Failed to upload Excel file. Please try again.';
                }
            });
        }
        
        // Reset the input value so the same file can be selected again
        event.target.value = null;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
