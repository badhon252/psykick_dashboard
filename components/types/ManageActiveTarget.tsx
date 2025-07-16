/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";

// TMC Active target
export type TMCActiveTarget = {
  outcomeDuration: any;
  startTime: string | number | Date;
  gameDuration: any;
  revealDuration: any;
  bufferDuration: any;
  outcomeTime: any;
  resultImage: any;
  image1: any;
  image2: any;
  image3: any;
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
  eventName: string;
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
// This is a placeholder for your actual type definitions.
// Ensure these types match the structure of your API responses.

export interface TMCBaseTarget {
  _id: string;
  code: string;
  revealTime: string; // ISO date string
  gameTime: string; // ISO date string
  bufferTime: string; // ISO date string
  // Add other common fields
}

export interface TMCActiveTargetData {
  _id: string;
  code: string;
  revealTime: string; // ISO date string
  gameTime: string; // ISO date string
  bufferTime: string; // ISO date string
  // ... other properties specific to an active target
}

export interface MutationApiResponse {
  status: boolean;
  message: string;
  data?: any; // Optional data field from mutation responses
}
