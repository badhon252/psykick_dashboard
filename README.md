# Psykick Club Dashboard Documentation

This document outlines the functionality and structure of the **Psykick Club Dashboard** application. The dashboard is a web application used for managing and participating in remote viewing challenges — specifically the **Target Match Challenge (TMC)** and **Associative Remote Viewing (ARV)** challenges.

---

## I. Overview

The Psykick Club Dashboard is developed using **Next.js** with **TypeScript**, integrating various modern UI libraries like:

- **Radix UI**
- **Lucide-React**
- **React Toastify**

Authentication is handled via a **React Context (AuthContext)** and enforced using **ProtectedRoute** and **PublicRoute** components. User data and authentication tokens are stored in `localStorage`.

---

## II. Admin Features

### 1. Target Creation

Admins can create new targets for both TMC and ARV challenges.

### 2. Target Management

- **List All Targets**  
  `GET /TMCTarget/get-allTMCTargets`

- **Queue/Unqueue Targets**  
  `PATCH /TMCTarget/update-TMCTarget-addToQueue/:id`

- **Monitor Active Targets**  
  `GET /TMCTarget/get-activeTMCTarget`

- **Set Reveal/Game Timings**  
  (Inferred from code and documentation)

### 3. Image and Category Management

- Upload and manage images for targets and controls.
- Add and manage categories using forms like `UploadImageForm` and `AddCategoryForm`.

### 4. User Management

- Authentication system suggests admin can manage users (e.g., roles, permissions, etc.)

### 5. Result Monitoring

- Admin likely has access to user submissions and challenge results (TMC & ARV).

---

## III. User Features

### 1. Challenge Participation (TMC)

- View active TMC challenges.
- Receive target codes and time limits.
- Submit impressions (likely via a canvas UI).
- Select target images from a set (target + controls).

### 2. Challenge Participation (ARV)

- Similar to TMC but handled via components like `ArvActiveTarget` and `ArvInactiveTargets`.

### 3. Results & Scoring

- **View TMC Results**

  - `GET /userSubmission/get-TMCResult/:TMCTargetId`
  - `GET /userSubmission/get-previousTMCResults`

- **View ARV Results**
  - Handled in `arv-reveal.tsx`
  - Points are updated via `updateARVPoints`.

### 4. Profile Management

- Users can view their completed targets, success rate, and visual progress (graphs/charts).

---

## IV. Technical Details

- **Framework**: Next.js
- **Language**: TypeScript
- **UI Libraries**: Radix UI, Lucide-React, React Toastify
- **State Management**: React Context API (e.g., `AuthContext`, `AppProvider`), React Query (`useQuery`, `useMutation`)
- **Authentication**: JWT token stored in `localStorage`
- **API Base URL**: `process.env.NEXT_PUBLIC_BACKEND_URL`
- **Routing**: Client-side routing using `useRouter`, `usePathname`
- **Error Handling**: Basic support via `ErrorContainer.tsx`

---
