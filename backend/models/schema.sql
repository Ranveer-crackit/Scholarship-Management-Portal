-- USERS table (already shared earlier)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('student', 'institution', 'government') NOT NULL
);

-- SCHOLARSHIPS table
CREATE TABLE IF NOT EXISTS scholarships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  eligibility_criteria TEXT,
  amount DECIMAL(10,2),
  application_deadline DATE,
  status ENUM('open', 'closed') DEFAULT 'open'
);

-- APPLICATIONS table
CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  scholarship_id INT,
  institution_id INT,
  status ENUM('pending', 'institution_verified', 'approved', 'paid', 'rejected'),
  submission_date DATETIME,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (institution_id) REFERENCES users(id),
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id)
);

-- PAYMENTS table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT,
  amount_distributed DECIMAL(10,2),
  date_of_transfer DATETIME,
  transaction_status ENUM('Success', 'Failed'),
  FOREIGN KEY (application_id) REFERENCES applications(id)
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  phone VARCHAR(20),
  guardian_name VARCHAR(100),
  guardian_contact VARCHAR(20),
  course_name VARCHAR(100),
  year_of_study INT,
  institution_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (institution_id) REFERENCES users(id) ON DELETE SET NULL
);



CREATE TABLE IF NOT EXISTS institutions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  institution_name VARCHAR(150) NOT NULL,
  type ENUM('school', 'college', 'university', 'training_center', 'other') NOT NULL,
  registration_number VARCHAR(100) UNIQUE,
  address TEXT NOT NULL,
  district VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  contact_person_name VARCHAR(100),
  contact_person_designation VARCHAR(100),
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  affiliation_details TEXT,
  established_year YEAR,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

