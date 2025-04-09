// types.ts

// Represents lat/lng coordinates
export type LatLng = {
    lat: number;
    lng: number;
  };
  
  // Represents location-based filter data
  export type LocationData = {
    radius: number;
    center: LatLng;
  };
  
  // Represents the shape of a product object
  export interface ProductType {
    _id: string;
    productName: string;
    category: {
      categoryId: string;
      categoryName: string;
    };
    price: number;
    quantity: number;
    soldQuantity: number;
    avgRating: number;
    review: {
      customerId: string;
      comment: string;
      rating: number;
      createdDate: string;
    }[];
    merchantDetail: {
      merchantId: string;
      merchantName: string;
      merchantEmail: string;
    };
    isBanned: boolean;
  }

  export interface ProductDetailsDialogProps {
    product: any
    open: boolean
    onOpenChange: (open: boolean) => void
    onAction: (action: { type: string; productId: string; reason?: string; description?: string }) => void
    isLoading: boolean
  }