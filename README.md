# Hostel-Information-System

-- 1. ROOM
CREATE TABLE rooms (
  room_id           INT AUTO_INCREMENT PRIMARY KEY,
  room_number       VARCHAR(10)       NOT NULL,
  capacity          INT               NOT NULL,
  current_occupants INT               NOT NULL DEFAULT 0
);

-- 2. STUDENT
CREATE TABLE students (
  student_id     INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100)       NOT NULL,
  email          VARCHAR(100)       NOT NULL UNIQUE,
  contact_number VARCHAR(20),
  room_id        INT,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

-- 3. COMPLAINT
CREATE TABLE complaints (
  complaint_id  INT AUTO_INCREMENT PRIMARY KEY,
  student_id    INT               NOT NULL,
  category      ENUM('electrical','plumbing','internet','furniture','sanitation')
                                NOT NULL,
  description   TEXT,
  submitted_at  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status        ENUM('Pending','Approved','In Progress','Resolved')
                                NOT NULL DEFAULT 'Pending',
  priority      ENUM('Low','Medium','High','Critical')
                                NOT NULL DEFAULT 'Low',
  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 4. ASSET
CREATE TABLE assets (
  asset_id         INT AUTO_INCREMENT PRIMARY KEY,
  type             VARCHAR(50)       NOT NULL,
  location         VARCHAR(100),
  current_condition ENUM('Operational','Needs Repair','Out of Service')
                                NOT NULL DEFAULT 'Operational',
  purchase_date    DATE,
  replacement_date DATE
);

-- 5. MAINTENANCE LOG (history for each asset)
CREATE TABLE maintenance_logs (
  log_id       INT AUTO_INCREMENT PRIMARY KEY,
  asset_id     INT               NOT NULL,
  requested_by INT,                       -- could be student or staff
  request_date DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status       ENUM('Pending','In Progress','Completed')
                                NOT NULL DEFAULT 'Pending',
  notes        TEXT,
  FOREIGN KEY (asset_id) REFERENCES assets(asset_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (requested_by) REFERENCES students(student_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

-- 6. LOST ITEMS (to power lost-and-found & notifications)
CREATE TABLE lost_items (
  lost_item_id     INT AUTO_INCREMENT PRIMARY KEY,
  student_id       INT               NOT NULL,
  item_description VARCHAR(255),
  incident_date    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status           ENUM('Lost','Found','Returned')
                                NOT NULL DEFAULT 'Lost',
  FOREIGN KEY (student_id) REFERENCES students(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 7. NOTIFICATION
CREATE TABLE notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  recipient_id    INT               NOT NULL,
  lost_item_id    INT,                        -- nullable: only for lost-item alerts
  message_content TEXT,
  created_at      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_read         BOOLEAN           NOT NULL DEFAULT FALSE,
  FOREIGN KEY (recipient_id) REFERENCES students(student_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (lost_item_id) REFERENCES lost_items(lost_item_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);
