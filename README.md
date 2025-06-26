## 🧰 8.1. Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **HTTP Requests:** Axios
- **File Uploads:** Multer
- **Database:** MySQL
- **Utilities:** dotenv, nodemon, CORS, MySQL2
- 
## 📸 8.2. System Walkthrough (Screenshots)

### 🧾 8.3.1 Student Raises a Complaint
- Students enter their roll number and complaint details.
- Complaint status is shown after submission.
  
 ![Student Complaint Submission](https://github.com/user-attachments/assets/0e877d75-e29b-441e-bd14-b13b76b3ed2a)


### 🔐 8.3.2 Warden/Admin Login
- Role-based login for Warden , Student-Admin-Body and Wing Representative.
  
 ![Role-Based Login](https://github.com/user-attachments/assets/60107eaf-fb67-4b88-ba44-fc054e50bc62)


### 🗂️ 8.3.3 Wing Representative Dashboard
- View and approve/reject new complaints.
  
 ![Wing Rep Dashboard](https://github.com/user-attachments/assets/33920a84-0033-4000-9102-79d125685a02)


### 🧑‍⚖️ 8.3.4 Prefect Dashboard
- Prefect can resolve or escalate complaints.
 ![Prefect Dashboard](https://github.com/user-attachments/assets/8ee70c27-20c5-4209-9389-ce6f5753a680)


### 🧾 8.3.5 Warden Dashboard and Logs
- Warden handles escalated complaints and updates logs.
  
 ![Warden Dashboard](https://github.com/user-attachments/assets/b10a7a8c-9d23-44ba-88e9-45f6d94c4bc5)



### ✅ 8.3.6 Final Complaint Resolution by Prefect
- Prefect closes complaints after Warden’s action.
  
 ![Final Resolution](https://github.com/user-attachments/assets/0869acca-4096-41f4-b68f-bed609f65dcd)


---

### 🏠 8.4 Room and Boarder Management
- Modal shows boarders in a selected room; allows adding/removing.
- Color-coded rooms:
  - 🔵 Blue: 2 vacant
  - 🟡 Yellow: 1 vacant
  - 🔴 Red: full

![Room View](https://github.com/user-attachments/assets/96f4f146-8b99-40cb-a3f3-3e5cf191bc00)

- On selecting a room, a modal opens showing current boarders along with options to add or remove boarders. This interface is accessible to both prefects and the warden
  
 ![add_remove_boarder](https://github.com/user-attachments/assets/0ebe2cbc-52d4-4cd7-90b5-1d7f3d3b50b3)


---

### 🏘️ 8.5 Wing Management
- Prefect or Warden creates wings and assigns Wing Representatives.
 ![wing_management_add](https://github.com/user-attachments/assets/b93e93d3-a7d8-427f-a222-751b997b20e3)

- The prefect or warden can add new wings and assign a Wing Representative. Each wing is associated with a range of room numbers. Once a wing is added, its corresponding rooms become active and manageable in the system. After a wing is added, the rooms in its assigned range are unlocked and visible in the boarder management view, enabling boarder allocation and complaint tracking.


---

### 📢 8.6 Notice Upload
- Warden uploads notice with title, description, and PDF.
- Notices appear on public page for students to view/download.
- 
![upload_notice](https://github.com/user-attachments/assets/2ca80b8a-5dd7-4080-83af-9229fa80ef34)

![homepage_notice](https://github.com/user-attachments/assets/3fc6d2fa-d802-447f-8a9f-2fa9292c95b9)

- The warden can upload a new notice by providing a title, a short description, and a PDF file. 

- All uploaded notices are displayed on the hostel’s public landing page, where students and visitors can view or download the PDF files.
