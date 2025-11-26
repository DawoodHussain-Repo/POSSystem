// Mock Product Database
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: 'grocery' | 'electronics' | 'clothing';
}

export interface RentalProduct {
  id: string;
  name: string;
  rentalPrice: number;
  stock: number;
  category: 'movie' | 'book' | 'equipment';
}

export const products: Product[] = [
  { id: '1000', name: 'Potato', price: 1.00, stock: 249, category: 'grocery' },
  { id: '1001', name: 'Plastic Cup', price: 0.50, stock: 376, category: 'grocery' },
  { id: '1002', name: 'Tomato', price: 1.50, stock: 180, category: 'grocery' },
  { id: '1003', name: 'Onion', price: 0.80, stock: 220, category: 'grocery' },
  { id: '1004', name: 'Carrot', price: 1.20, stock: 150, category: 'grocery' },
  { id: '1005', name: 'Bread', price: 2.50, stock: 95, category: 'grocery' },
  { id: '1006', name: 'Milk (1L)', price: 3.99, stock: 120, category: 'grocery' },
  { id: '1007', name: 'Eggs (12)', price: 4.50, stock: 85, category: 'grocery' },
  { id: '1008', name: 'Cheese', price: 5.99, stock: 60, category: 'grocery' },
  { id: '1009', name: 'Butter', price: 4.25, stock: 75, category: 'grocery' },
  { id: '2000', name: 'USB Cable', price: 9.99, stock: 150, category: 'electronics' },
  { id: '2001', name: 'Phone Charger', price: 15.99, stock: 100, category: 'electronics' },
  { id: '2002', name: 'Headphones', price: 29.99, stock: 45, category: 'electronics' },
  { id: '2003', name: 'Mouse', price: 19.99, stock: 80, category: 'electronics' },
  { id: '2004', name: 'Keyboard', price: 39.99, stock: 55, category: 'electronics' },
  { id: '3000', name: 'T-Shirt', price: 12.99, stock: 200, category: 'clothing' },
  { id: '3001', name: 'Jeans', price: 39.99, stock: 120, category: 'clothing' },
  { id: '3002', name: 'Socks (3-pack)', price: 8.99, stock: 180, category: 'clothing' },
];

export const rentalProducts: RentalProduct[] = [
  { id: '1000', name: 'Theory Of Everything', rentalPrice: 30.00, stock: 249, category: 'movie' },
  { id: '1001', name: 'Adventures Of Tom Sawyer', rentalPrice: 40.50, stock: 391, category: 'book' },
  { id: '1002', name: 'Interstellar', rentalPrice: 35.00, stock: 180, category: 'movie' },
  { id: '1003', name: 'The Martian', rentalPrice: 32.00, stock: 150, category: 'movie' },
  { id: '1004', name: 'Harry Potter Complete Set', rentalPrice: 55.00, stock: 85, category: 'book' },
  { id: '1005', name: 'Lord of the Rings Trilogy', rentalPrice: 50.00, stock: 95, category: 'book' },
  { id: '1006', name: 'Inception', rentalPrice: 33.00, stock: 120, category: 'movie' },
  { id: '1007', name: 'The Great Gatsby', rentalPrice: 25.00, stock: 200, category: 'book' },
  { id: '1008', name: 'Camera Equipment', rentalPrice: 75.00, stock: 25, category: 'equipment' },
  { id: '1009', name: 'Projector', rentalPrice: 85.00, stock: 15, category: 'equipment' },
  { id: '1010', name: 'Gaming Console', rentalPrice: 65.00, stock: 40, category: 'equipment' },
];

export const findProduct = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const findRentalProduct = (id: string): RentalProduct | undefined => {
  return rentalProducts.find(p => p.id === id);
};

// Mock customer rental data
export interface CustomerRental {
  itemId: string;
  itemName: string;
  rentalPrice: number;
  rentalDate: string;
  daysLate: number;
}

export const getCustomerRentals = (phone: string): CustomerRental[] => {
  // Mock data - in real app, fetch from database
  const today = new Date();
  const pastDate1 = new Date(today);
  pastDate1.setDate(today.getDate() - 10); // 10 days ago
  
  const pastDate2 = new Date(today);
  pastDate2.setDate(today.getDate() - 3); // 3 days ago

  return [
    {
      itemId: '1000',
      itemName: 'Theory Of Everything',
      rentalPrice: 30.00,
      rentalDate: pastDate1.toISOString().split('T')[0],
      daysLate: 3
    },
    {
      itemId: '1001',
      itemName: 'Adventures Of Tom Sawyer',
      rentalPrice: 40.50,
      rentalDate: pastDate2.toISOString().split('T')[0],
      daysLate: 0
    }
  ];
};
