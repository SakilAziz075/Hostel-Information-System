# 🏨 Hostel Information System

![Landing Page](https://github.com/user-attachments/assets/b11a898f-535d-4cd9-a3de-0e46ef97fac0)

## 1. 🎓 Introduction

This web-based Hostel Information System was developed as a part of my **6th Semester Mini Project**. The objective of this system is to streamline hostel operations, automate complaint management workflows, manage boarder allocation, and improve communication between students and hostel authorities through a digital dashboard.

The system supports:
- Complaint submission and escalation
- Boarder and room tracking
- Wing and representative management
- Digital notice publishing

The intuitive landing page above gives users an overview and access point to the system based on their role.


## 🧰 Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js with Express.js  
- **HTTP Requests:** Axios  
- **File Uploads:** Multer  
- **Database:** MySQL  
- **Utilities:** dotenv, nodemon, CORS, MySQL2  

---
## ⚙️ Project Setup & Installation

### 📁 Environment Variables

Create a `.env` file inside the `backend/` directory with the following content:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME= HostelInformationSystem
JWT_SECRET=Your_string_here
JWT_EXPIRES_IN=1h
```

> ⚠️ Ensure MySQL is running and a database named `HostelInformationSystem` exists and have the schema specified in schema.txt

---

### Backend Setup

```bash
cd backend
npm install
node server.js
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```


## 🖼️ User Interface Walkthrough

### 🧾 Student Raises a Complaint
- Students enter their roll number and complaint details.
- Complaint status is shown after submission.

![Student Complaint Submission](https://github.com/user-attachments/assets/0e877d75-e29b-441e-bd14-b13b76b3ed2a)  
*Figure: Complaint submission form and status view for students*

---

### 🔐 Warden/Admin Login
- Role-based login for Warden, Student-Admin-Body, and Wing Representative.

![Role-Based Login](https://github.com/user-attachments/assets/60107eaf-fb67-4b88-ba44-fc054e50bc62)  
*Figure: Role selection and login page for hostel authorities*

---

### 🗂️ Wing Representative Dashboard
- View and approve/reject new complaints.

![Wing Rep Dashboard](https://github.com/user-attachments/assets/33920a84-0033-4000-9102-79d125685a02)  
*Figure: Wing representative’s interface to manage new complaints*

---

### 🧑‍⚖️ Prefect Dashboard
- Prefect can resolve or escalate complaints.

![Prefect Dashboard](https://github.com/user-attachments/assets/8ee70c27-20c5-4209-9389-ce6f5753a680)  
*Figure: Prefect dashboard to escalate or resolve complaints*

---

### 📋 Warden Dashboard and Logs
- Warden handles escalated complaints and updates logs.

![Warden Dashboard](https://github.com/user-attachments/assets/b10a7a8c-9d23-44ba-88e9-45f6d94c4bc5)  
*Figure: Warden view with log entries and complaint progress*

---

### ✅ Final Complaint Resolution by Prefect
- Prefect closes complaints after Warden’s action.

![Final Resolution](https://github.com/user-attachments/assets/0869acca-4096-41f4-b68f-bed609f65dcd)  
*Figure: Prefect marks complaint as resolved after Warden input*

---

### 🏠 Room and Boarder Management
- Color-coded rooms:
  - 🔵 Blue: 2 vacant
  - 🟡 Yellow: 1 vacant
  - 🔴 Red: Full
- Selecting a room opens a modal to view, add, or remove boarders.

![Room View](https://github.com/user-attachments/assets/96f4f146-8b99-40cb-a3f3-3e5cf191bc00)  
*Figure: Dashboard view of room availability based on occupancy*

![Add/Remove Boarders](https://github.com/user-attachments/assets/0ebe2cbc-52d4-4cd7-90b5-1d7f3d3b50b3)  
*Figure: Modal to manage boarders for a selected room*

---

### 🏘️ Wing Management
- Prefect or Warden can:
  - Add new wings
  - Assign Wing Representatives
  - Map a range of rooms to each wing

![Wing Management](https://github.com/user-attachments/assets/b93e93d3-a7d8-427f-a222-751b997b20e3)  
*Figure: Wing creation and assignment with room mapping*

> Once a wing is created and assigned, its rooms become visible and manageable in the boarder management view.

---

### 📢 Notice Upload
- Warden uploads notices with:
  - Title
  - Description
  - Optional PDF file
- Notices appear on the public page for students to view or download.

![Notice Upload](https://github.com/user-attachments/assets/2ca80b8a-5dd7-4080-83af-9229fa80ef34)  
*Figure: Warden interface to upload notices and PDFs*

![Public Notice Board](https://github.com/user-attachments/assets/3fc6d2fa-d802-447f-8a9f-2fa9292c95b9)  
*Figure: Public-facing landing page showing all uploaded notices*


## Future Scope

The following modules and enhancements are planned for upcoming versions of the Hostel Information System:

- 🧾 **Asset Tracking and Maintenance Logging**  
  Tables for hostel assets and maintenance logs already exist. These will be used to:
  - Maintain records of furniture, appliances, and shared resources
  - Track resolution timelines and vendor/service history

- 🔍 **Lost and Found Module**  
  A centralized lost and found system will allow:
  - Students to report or search for lost items across hostels
  - Hostel admins to review, moderate, and publish verified reports
  > *Note: The database table is provisioned, but the module was not completed due to time constraints.*

- 🔁 **Room Change Request System**  
  A workflow-based interface where:
  - Students can raise room change requests with reasons
  - Status tracking and notifications are automated

- 💳 **Integrated Payment Gateway**  
  To simplify mess fee payments by integrating:
  - UPI, card, and net banking options
  - Auto-generated receipts and transaction logs
---

> These additions aim to make the system more robust, transparent, and helpful for both students and hostel administrators.
