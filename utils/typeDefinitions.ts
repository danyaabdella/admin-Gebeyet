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

  export interface Product {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    delivery: "FREE" | "PERPIECS" | "FLAT" | string;
    deliveryPrice: number;
  }
  
  import { Document, Types } from 'mongoose';

export interface Address {
  state: string;
  city: string;
}

export interface CustomerDetail {
  customerId: Types.ObjectId;
  customerName: string;
  phoneNumber: string;
  customerEmail: string;
  address: Address;
}

export interface MerchantDetail {
  merchantId: Types.ObjectId;
  merchantName: string;
  merchantEmail: string;
  phoneNumber: string;
  account_name: string;
  account_number: string;
  merchantRefernce?: string | null;
  bank_code: string;
}

export interface ProductItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  price: number;
  delivery: 'FLAT' | 'PERPIECS' | 'PERKG' | 'FREE';
  deliveryPrice: number;
}

export interface AuctionDetail {
  auctionId?: Types.ObjectId;
  delivery?: 'PAID' | 'FREE';
  deliveryPrice?: number;
}

export interface Location {
  type: string;
  coordinates: [number, number]; // longitude, latitude
}

export interface OrderDocument extends Document {
  customerDetail: CustomerDetail;
  merchantDetail: MerchantDetail;
  products: ProductItem[];
  auction?: AuctionDetail;
  totalPrice: number;
  status: 'Pending' | 'Dispatched' | 'Received';
  paymentStatus: 'Pending' | 'Paid' | 'Paid To Merchant' | 'Pending Refund' | 'Refunded';
  location: Location;
  transactionRef: string;
  orderDate: Date;
  refundReason?: string;
}


  // Initialize filter object
        // let filter = {};

        // // Extract query parameters
        // const productId = searchParams.get('productId');
        // const merchantId = searchParams.get('merchantId');
        // const customerId = searchParams.get('customerId');
        // const status = searchParams.get('status');
        // const minPrice = searchParams.get('minPrice');
        // const maxPrice = searchParams.get('maxPrice');
        // const startDate = searchParams.get('startDate');
        // const endDate = searchParams.get('endDate');
        // const merchantEmail = searchParams.get('merchantEmail');
        // const customerEmail = searchParams.get('customerEmail');
        // const state = searchParams.get('state');
        // const city = searchParams.get('city');

        // Apply filters
        // if (productId) filter["products.productId"] = new mongoose.Types.ObjectId(productId);
        // if (merchantId) filter["merchantDetail.merchantId"] = new mongoose.Types.ObjectId(merchantId);
        // if (customerId) filter["customerDetail.customerId"] = new mongoose.Types.ObjectId(customerId);
        // if (status) filter.status = status;

        // // Apply price range filter
        // if (minPrice || maxPrice) {
        //     filter.totalPrice = {};
        //     if (minPrice) filter.totalPrice.$gte = Number(minPrice);
        //     if (maxPrice) filter.totalPrice.$lte = Number(maxPrice);
        // }

        // // Apply date range filter
        // if (startDate || endDate) {
        //     filter.orderDate = {};
        //     if (startDate) filter.orderDate.$gte = new Date(startDate);
        //     if (endDate) filter.orderDate.$lte = new Date(endDate);
        // }

        // Apply merchant email filter
        // if (merchantEmail) filter["merchantDetail.merchantEmail"] = merchantEmail;

        // Apply customer email filter
        // if (customerEmail) filter["customerDetail.customerEmail"] = customerEmail;

        // // Apply state and city filters
        // if (state) filter["customerDetail.address.state"] = state;
        // if (city) filter["customerDetail.address.city"] = city;

        // console.log("Filters: ", filter);

        // Fetch orders based on the filter