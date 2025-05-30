-- DROP & CREATE DATABASE
DROP DATABASE IF EXISTS MiniProject;
CREATE DATABASE MiniProject;
USE MiniProject;

-- 1. ROOMS
CREATE TABLE rooms (
  room_id           INT AUTO_INCREMENT PRIMARY KEY,
  room_number       VARCHAR(10) NOT NULL UNIQUE,
  capacity          INT         NOT NULL,
  current_occupants INT         NOT NULL DEFAULT 0
);

-- 2. STUDENTS (with roll number as student ID)
CREATE TABLE students (
  student_id     VARCHAR(20) PRIMARY KEY,  -- Changed to VARCHAR for roll number
  name           VARCHAR(100)    NOT NULL,
  email          VARCHAR(100)    NOT NULL UNIQUE,
  contact_number VARCHAR(20),
  room_number    VARCHAR(10)     NOT NULL,
  FOREIGN KEY (room_number) REFERENCES rooms(room_number)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- 3. COMPLAINTS (with escalation support)
CREATE TABLE complaints (
  complaint_id     INT AUTO_INCREMENT PRIMARY KEY,
  student_id       VARCHAR(20)            NOT NULL,  -- Changed to match roll number format
  category         ENUM('electrical','plumbing','internet','furniture','sanitation') NOT NULL,
  description      TEXT,
  submitted_at     DATETIME               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status           ENUM('Pending','In Progress','Resolved') NOT NULL DEFAULT 'Pending',
  priority         ENUM('Low','Medium','High','Critical')   NOT NULL DEFAULT 'Low',

  -- Escalation fields
  approval_status  ENUM('Pending', 'Approved', 'Rejected')  NOT NULL DEFAULT 'Pending',
  assigned_to      VARCHAR(20)           NOT NULL,  -- Changed to student_id to reference the assigned person

  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES students(student_id)  -- Add this foreign key to reference the assigned person
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);



-- 4. ASSETS
CREATE TABLE assets (
  asset_id          INT AUTO_INCREMENT PRIMARY KEY,
  type              VARCHAR(50)         NOT NULL,
  location          VARCHAR(100),
  current_condition ENUM('Operational','Needs Repair','Out of Service') NOT NULL DEFAULT 'Operational',
  purchase_date     DATE,
  replacement_date  DATE
);

-- 5. MAINTENANCE LOG
CREATE TABLE maintenance_logs (
  log_id       INT AUTO_INCREMENT PRIMARY KEY,
  asset_id     INT           NOT NULL,
  requested_by VARCHAR(20),  -- Changed to match roll number format
  request_date DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status       ENUM('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
  notes        TEXT,
  FOREIGN KEY (asset_id) REFERENCES assets(asset_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (requested_by) REFERENCES students(student_id)  -- Updated to reference roll number
    ON UPDATE CASCADE
    ON DELETE SET NULL
);


-- 6. LOST ITEMS
CREATE TABLE lost_items (
  lost_item_id     INT AUTO_INCREMENT PRIMARY KEY,
  student_id       VARCHAR(20)          NOT NULL,
  item_description VARCHAR(255),
  incident_date    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status           ENUM('Lost','Found','Returned') NOT NULL DEFAULT 'Lost',
  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 7. NOTIFICATIONS
CREATE TABLE notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(255)     NOT NULL,
  description     TEXT             NOT NULL,
  pdf_path        VARCHAR(255),               -- Store the file path of the PDF
  created_by      INT              NOT NULL,   -- FK to warden (users.user_id)
  created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (created_by) REFERENCES users(user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- 8. USERS
CREATE TABLE users (
  user_id   INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(100) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  role      ENUM('warden', 'prefect', 'wing representatives')
);

-- 9. WINGS
CREATE TABLE wings (
  wing_id           INT AUTO_INCREMENT PRIMARY KEY,
  wing_name         VARCHAR(50) NOT NULL UNIQUE,
  representative_id VARCHAR(20),
  room_start        VARCHAR(10) NOT NULL,
  room_end          VARCHAR(10) NOT NULL,
  FOREIGN KEY (representative_id) REFERENCES students(student_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);


--10. WARDEN COMPLAINT TABLE
CREATE TABLE warden_complaints (
  warden_complaint_id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id        INT NOT NULL,  -- References the original complaint
  student_id          VARCHAR(20) NOT NULL,  -- Roll number of the student who filed the complaint
  category            ENUM('electrical', 'plumbing', 'internet', 'furniture', 'sanitation') NOT NULL,
  description         TEXT,
  submitted_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status              ENUM('Pending', 'In Progress', 'Resolved') NOT NULL DEFAULT 'Pending',
  priority            ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Low',
  action_taken        TEXT,  -- Optional field for any actions taken by the warden
  FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- 11. TO SEE PROGRESS

CREATE TABLE complaint_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    warden_complaint_id INT,
    update_text TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (warden_complaint_id) REFERENCES warden_complaints(warden_complaint_id) ON DELETE CASCADE
);
