// TMC target queue lists data type 

export type TMCTargetList = {
  _id: string;
  code: string;
  targetImage: string;
  controlImages: string[];
  revealTime: string;
  bufferTime: string;
  gameTime: string;
  isActive: boolean;
  isQueued: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

export type TMCTargetsListResponse = {
  status: boolean;
  data: TMCTargetList[];
  pagination: Pagination;
  message: string;
};



// ARV target queue lists data type  

export interface ARVTarget {
    image1: {
      url: string;
      description: string;
    };
    image2: {
      url: string;
      description: string;
    };
    image3: {
      url: string;
      description: string;
    };
    _id: string;
    code: string;
    eventName: string;
    eventDescription: string;
    revealTime: string; // ISO date string
    outcomeTime: string; // ISO date string
    bufferTime: string; // ISO date string
    gameTime: string; // ISO date string
    controlImage: string;
    resultImage: string;
    isActive: boolean;
    isQueued: boolean;
    isCompleted: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }
  
  export interface ArvPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }
  
  export interface ARVTargetsResponse {
    status: boolean;
    data: ARVTarget[];
    pagination: ArvPagination;
    message: string;
  }
  
