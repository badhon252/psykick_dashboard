// TMC Part 

export interface TMCTarget {
  _id: string;
  code: string;
  targetImage: string;
  controlImages: string[];
  revealTime: string; // ISO date string
  bufferTime: string; // ISO date string
  gameTime: string; // ISO date string
  isActive: boolean;
  isQueued: boolean;
  isCompleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface TMCTargetsResponse {
  status: boolean;
  data: TMCTarget[];
  pagination: Pagination;
  message: string;
}



// ARV part  

export interface ImageInfo {
    url: string;
    description: string;
  }
  
  export interface ARVTarget {
    _id: string;
    code: string;
    eventName: string;
    eventDescription: string;
    image1: ImageInfo;
    image2: ImageInfo;
    image3: ImageInfo;
    revealTime: string | null;
    outcomeTime: string | null;
    bufferTime?: string; // optional because some entries don't have it
    gameTime?: string;   // optional because some entries don't have it
    controlImage: string;
    resultImage: string;
    isActive: boolean;
    isQueued: boolean;
    isCompleted: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ARVPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }
  
  export interface ARVTargetResponse {
    status: boolean;
    data: ARVTarget[];
    pagination: ARVPagination;
    message: string;
  }
  