
// all image gallery 
export interface CategoryImage {
  _id: string;
  categoryId: string;
  categoryName: string;
  subcategoryName: string;
  image: string ;
}

export interface CategoryImageApiResponse {
  status: boolean;
  data: CategoryImage[];
  message: string;
}


// category data type 
export interface Category {
  categoryName: string;
  subCategoryNames: string[];
}

export interface CategoryApiResponse {
  status: boolean;
  message: string;
  data: Category[];
}

