# Front-End Discussion

This documentation serves to describe the Front-End design, architecture and implementation.

## Tech-Stack
- 
- TailwindCSS

## Project
Digital Park Guide Training Platform for Sarawak’s National Parks and Nature Reserves

## Overview
The frontend of this project consists of two client applications:
- **Web application** built with React + Vite
- **Mobile application** built with React Native + Expo

The frontend will provide a user-friendly and accessible platform for park guides and administrators to manage training, track progress, view certifications, and receive important notifications.

## Frontend Objectives
- Build responsive and accessible interfaces for both web and mobile users
- Provide interactive training content in a simple and organized layout
- Support secure login and role-based access
- Enable users to monitor training progress and certification status
- Deliver notifications and important updates from administrators

## Target Users (TBA)
### Admin
- Manage training modules
- Monitor park guide progress
- Manage qualifications and certifications
- Send notifications and updates

### Park Guide
- Sign up for training modules
- Access learning materials
- Track personal progress
- View qualifications and certifications
- Receive notifications from admin

## Core Features
### 1. Authentication and Access Control
- Secure login screen
- Role-based access for Admin and Park Guide
- Protected routes/pages for authorized users only

### 2. Training Module Interface
- Display training modules by category:
  - Conservation
  - Biodiversity
  - Eco-tourism
  - Legislation
  - Safety
- Support multimedia learning content:
  - Videos
  - Images
  - Interactive infographics
  - Quizzes

### 3. Progress Tracking
- Show completed and ongoing modules
- Display learning progress in percentage or status form
- Allow users to monitor training history

### 4. Certification Management
- View earned certifications
- Display qualification records
- Allow admin to verify and manage certifications

### 5. Notifications
- In-app notifications for training updates
- Reminders for incomplete modules
- Announcements from admin

### 6. Security Features
- Secure handling of login sessions
- Frontend validation for forms
- Restricted page access based on role

## Frontend Structure
```text
frontend/
├─ web/              # React + Vite web application
├─ mobile/           # React Native + Expo mobile application
└─ README.md