# Academic Timetabling and Scheduling System

This repository contains the source code for "Revolutionising Academic Scheduling with Advanced Timetabling Solutions," a final year BSc Computer Science project from the University of Manchester. The project is a comprehensive web-based system designed to automate and optimise the complex process of academic scheduling using Integer Linear Programming (ILP).

## Table of Contents
- [Project Purpose](#project-purpose)
- [Problems Solved](#problems-solved)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [Known Limitations](#known-limitations)
- [Future Work](#future-work)
- [Author](#author)

## Project Purpose

The primary goal of this project is to design, implement, and evaluate a robust, user-friendly, and efficient web-based academic scheduling system. Traditional manual scheduling methods are often time-consuming, prone to errors, and struggle to find optimal solutions. This project addresses these challenges by providing an automated solution capable of generating feasible and high-quality timetables while offering essential administrative and user functionalities.

The system is built to handle the inherent complexities of academic scheduling, which is an NP-hard combinatorial optimisation problem, by balancing hard constraints (e.g., no double-bookings) and soft constraints (e.g., scheduling classes earlier in the day).

## Problems Solved

This system was developed to solve several key problems in academic scheduling:

1.  **Complexity and Inefficiency:** Replaces manual, error-prone scheduling with a fast, automated process.
2.  **Resource Conflicts:** Enforces hard constraints to prevent common issues like double-booking of rooms, instructors, or students.
3.  **Scalability Issues:** Addresses the challenge of scheduling for a growing number of students and courses, which makes manual methods impractical. The system was tested with datasets of up to 2400 students.
4.  **Lack of Optimisation:** Aims to produce higher-quality schedules by considering soft constraints, such as preferring earlier class times to improve student and instructor satisfaction.
5.  **Poor User Experience:** Provides distinct, role-based interfaces for administrators, instructors, and students, improving usability and access to relevant information.

## Key Features

The application is a Single-Page Application (SPA) with role-based access control for three user types: **Administrators**, **Instructors**, and **Students**.

### For All Users:
*   **Secure Authentication:** Secure login and registration system with hashed passwords and JSON Web Token (JWT) for session management.
*   **Personal Timetable View:** Users can view their own weekly schedule in a clear, interactive grid format.
*   **Friend Management:** Students can send, accept, and decline friend requests to view each other's schedules, facilitating coordination for study groups.
*   **Feedback System:** Users can submit, view, edit, and delete their own feedback (compliments, suggestions, complaints).

### Administrator Features:
*   **Global Timetable View:** View the complete schedule for the entire institution.
*   **CRUD Operations:** Full control to create, read, update, and delete all system entities, including users, rooms, courses, and classes.
*   **Schedule Generation:** Generate the master timetable for all courses by invoking the ILP solver.
*   **Conflict Detection:** When manually adding or editing a class, the system provides real-time alerts for any potential conflicts (student, instructor, or room clashes).
*   **View All Feedback:** Administrators can view all feedback submitted by users to aid in system improvement.

### Instructor Features:
*   **Edit Class Descriptions:** Instructors can modify the descriptions of the classes they teach.
*   **View Enrolled Students:** View a list of students enrolled in their classes.

## System Architecture

The project is built using a **client-server architecture** within a **monolithic repository**. This structure simplifies development and code sharing (especially TypeScript types) between the frontend and backend.

*   **Frontend (Client):** A Single-Page Application (SPA) built with React. It communicates with the backend via a RESTful API. A centralised state management system ensures data consistency across the UI.
*   **Backend (Server):** A Node.js and Express server that exposes REST API endpoints. It handles business logic, authentication, data persistence, and integration with the scheduling engine.
*   **Database:** A NoSQL (MongoDB) document-based database is used for its flexibility in handling varied data structures. Mongoose ODM is used to define schemas and manage data validation at the application level.
*   **Scheduling Engine:** The GNU Linear Programming Kit (GLPK), via its TypeScript implementation (`glpk-ts`), is integrated into the backend to solve the timetabling problem formulated as an Integer Linear Programming (ILP) model.

## Technology Stack

| Category          | Technology                                   |
| ----------------- | -------------------------------------------- |
| **Frontend**      | React, TypeScript, Vite                      |
| **Backend**       | Node.js, Express, TypeScript                 |
| **Database**      | MongoDB with Mongoose (ODM)                  |
| **Scheduling**    | GLPK (glpk-ts)                               |
| **Authentication**| JSON Web Tokens (JWT), bcrypt                |
| **Testing**       | Vitest, Postman (for manual API testing)     |
| **UI Design**     | Figma                                        |
| **Version Control**| Git & GitHub (with GitHub Projects)         |

## Known Limitations

*   **Scalability of the ILP Solver:** The ILP-based scheduling generation shows a non-linear increase in solution time as the number of students grows and fails to find a feasible solution for very large datasets (e.g., 2400 students) due to resource constraints.
*   **Soft Constraint Handling:** The current implementation does not effectively satisfy the soft constraint of prioritising earlier time slots, with generated schedules often utilising late slots heavily.
*   **Infeasibility Feedback:** When a schedule cannot be generated, the system returns a generic "No feasible solution found" error without detailing the specific bottleneck constraints.
*   **Static Weekly Schedules:** The system only generates static schedules that repeat weekly and cannot handle ad-hoc events or temporary changes.
*   **Lack of Formal Usability Testing:** The UI design follows established principles but has not been validated through formal usability studies with target end-users.

## Future Work

*   **Improve Optimisation Engine:** Integrate a more advanced and scalable optimisation engine like Google OR-Tools, potentially in a dedicated microservice.
*   **Enhance Soft Constraint Modelling:** Implement a wider range of soft constraints (e.g., minimising gaps between classes, instructor preferences) to improve schedule quality.
*   **Dynamic and Variable Scheduling:** Enable support for non-recurring events, ad-hoc room bookings, and variable weekly schedules.
*   **Usability Improvements:**
    *   Conduct formal usability studies with students, instructors, and administrators.
    *   Provide diagnostic feedback when schedule generation fails.
    *   Suggest conflict-free alternatives during manual class edits.
*   **Expanded Testing:** Develop a comprehensive suite of automated end-to-end tests and broaden security testing protocols.

## Author
*   **Charles Tsang**
