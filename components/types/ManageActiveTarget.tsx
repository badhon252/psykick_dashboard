import { ReactNode } from "react";

// TMC Active target
export type TMCActiveTarget = {
  eventName: ReactNode;
  _id: string;
  code: string;
  targetImage: string;
  controlImages: string[];
  revealTime: string; // ISO Date string
  bufferTime: string; // ISO Date string
  gameTime: string; // ISO Date string
  isActive: boolean;
  isQueued: boolean;
  isCompleted: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isPartiallyActive: boolean;
};

export type TMCActiveTargetResponse = {
  status: boolean;
  data: TMCActiveTarget;
  message: string;
};

// ARV Active Target

export interface ARVActiveTargetResponse {
  status: boolean;
  data: TMCActiveTarget;
  message: string;
}

export interface ARVActiveTarget {
  _id: string;
  code: string;
  eventName: string ;
  eventDescription: string;
  revealTime: string; // ISO date string
  outcomeTime: string; // ISO date string
  bufferTime: string; // ISO date string
  gameTime: string; // ISO date string
  image1: ImageInfo;
  image2: ImageInfo;
  image3: ImageInfo;
  controlImage: string;
  resultImage: string;
  isActive: boolean;
  isQueued: boolean;
  isCompleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isPartiallyActive: boolean;
}

export interface ImageInfo {
  url: string;
  description: string;
}
