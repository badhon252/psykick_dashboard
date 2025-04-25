export type CategoryImage = {
    category: string;
    imageUrl: string;
  };
  
  export type CategoryImageResponse = {
    status: boolean;
    data: CategoryImage[];
    message: string;
  };