import {
    ProductCategory,
    ProductColor,
    ProductSize,
    FrameMaterial,
    LensCoating,
    LensType,
} from '@/lib/constants'

export interface Variation {
    color: ProductColor;
    colorCode: string;
    colorImage: string;
    image: string;
}

export interface ProductType {
    id: string;
    category: ProductCategory | string;
    type: ProductCategory;
    name: string;
    gender: string;
    new: boolean;
    sale: boolean;
    rate: number;
    price: number;
    originPrice: number;
    brand: string;
    sold: number;
    quantity: number;
    quantityPurchase: number;
    sizes: ProductSize[];
    variation: Variation[];
    thumbImage: string[];
    images: string[];
    description: string;
    action: string;
    slug: string;
    lensType?: LensType | string;
    frameMaterial?: FrameMaterial | string;
    frameSize?: {
        bridgeWidth?: number;
        templeLength?: number;
        lensWidth?: number;
    };
    lensCoating?: LensCoating[] | string[];
}