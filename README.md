# CareSync - Clinical Management System

CareSync is a full-stack clinical management web portal. The system manages patient records, physician rosters with dynamic schedule selectors, and conflict-aware appointment bookings on a self-hosted Azure Ubuntu production environment.

---

##  Team Members
* **Swan Yi Aung** 

---

##  Live Production Deployment
* **Live System URL**: `http://caresync-clinic.malaysiawest.cloudapp.azure.com/`
* **Demonstration Video **: [YouTube Link] (https://youtu.be/RDpXLpGnKww)
* **Hosting Platform**: Microsoft Azure Virtual Machine (`myWeb1`, Ubuntu Linux)
* **Web Server / Reverse Proxy**: Nginx (Port 80 -> Internal Port 3000)
* **Process Manager**: PM2
* **Database**: MongoDB Atlas Cluster

---

## 📸 System Screenshots

### 1. Dashboard Overview
![Dashboard]
<img width="1920" height="1032" alt="Screenshot 2026-10-05 034805" src="https://github.com/user-attachments/assets/abf943f9-9e11-4c6c-b524-f0f9ec9f84ea" />


### 2. Medical Staff Roster & Dynamic 7-Day Picker
![Doctors Management]
<img width="1920" height="1032" alt="Screenshot 2026-10-05 034816" src="https://github.com/user-attachments/assets/28da9b05-ebb6-4eaf-be1a-89da82edce73" />


### 3. Patient Directory & Allergy Alerts
![Patients Management]
<img width="1920" height="1032" alt="Screenshot 2026-10-05 034812" src="https://github.com/user-attachments/assets/b87b2d25-75fe-48a8-94be-517441cc15e4" />


### 4. Appointment Booking & Schedule Validation Modal
![Appointments Booking]
<img width="1920" height="1032" alt="Screenshot 2026-10-05 034819" src="https://github.com/user-attachments/assets/4e8b6553-06d5-4da4-a47f-2a9150b71746" />


---

##  Tech Stack
* **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
* **Backend**: Next.js API Routes (Node.js runtime, RESTful architecture)
* **Database & ODM**: MongoDB with Mongoose
* **DevOps & Production**: Microsoft Azure VM, PM2, Nginx, Git

---

##  3 CRUD Data Models & Business Logic

The system implements complete Create, Read, Update, and Delete (CRUD) operations across three distinct, relational entities without using third-party managed backends:

### 1. Patient Entity (`/api/patients`)
* **Fields**: `name` (String), `phone` (String), `allergies` (String), `timestamps`.
* **Capabilities**:
  * Register new patients with contact numbers and allergy warnings.
  * Retrieve directory lists and individual patient details.
  * Edit and remove patient records with immediate frontend state synchronization.

### 2. Doctor Entity (`/api/doctors`)
* **Fields**: `name` (String), `specialty` (String), `fee` (Number), `availableDays` (String), `timestamps`.
* **Capabilities**:
  * Add clinical practitioners and specify consultation fees.
  * **Interactive 7-Day Scheduler**: Allows practitioners to configure dynamic weekly availability (e.g., `Mon, Wed, Fri` or `Sat, Sun`).
  * Edit physician profiles and remove staff from the active roster.

### 3. Appointment Entity (`/api/appointments`)
* **Fields**: `patientId` (ObjectId ref: 'Patient'), `doctorId` (ObjectId ref: 'Doctor'), `appointmentDate` (Date), `status` (String: Scheduled, Completed, Cancelled), `timestamps`.
* **Relational Querying**: Uses Mongoose `.populate()` to dynamically fetch linked patient and physician data.
* **Automated Schedule Validation**:
  * Validates the selected booking date against the assigned doctor's dynamic weekly availability.
  * Intercepts off-day bookings on the backend with an HTTP 400 response.
  * Triggers an informative, theme-styled UI modal explaining the scheduling conflict reason.
  * Supports status updates (`Scheduled`, `Completed`, `Cancelled`) and permanent booking cancellations.

---

## How to Run Locally
Prerequisites
Node.js (v18.17+ or v20+)

npm (bundled with Node.js)

Git

Step-by-Step Instructions
Clone the repository:

Bash
git clone https://github.com/seekerz12/web_app_pj_2.git
cd web_app_pj_2
Install project dependencies:

Bash
npm install
Configure environment variables:
Create a .env.local file in the root directory:

Bash
touch .env.local
Add your MongoDB connection URI inside .env.local:

Code snippet
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.hywpu7b.mongodb.net/caresync?appName=Cluster0
Start the local development server:

Bash
npm run dev
View the application:
Open http://localhost:3000 in your web browser.

## How to Run & Deploy on Azure Ubuntu VM (Production)
Prerequisites
Microsoft Azure Virtual Machine running Ubuntu Linux (e.g., myWeb1)

Azure Network Security Group (NSG) configured with inbound rules for:

Port 22 (SSH)

Port 80 (HTTP)

Node.js, npm, PM2, and Nginx installed on the VM

Step-by-Step Instructions
Connect to your Azure VM via SSH:

Bash
ssh swan@<your-azure-vm-ip>
Clone the project repository to /var/www:

Bash
cd /var/www
git clone <your-github-repo-url> web_app_pj_2
cd web_app_pj_2
Install dependencies:

Bash
npm install
Set up production environment variables:
Create and open .env.local in the project directory:

Bash
nano .env.local
Paste your production MongoDB URI:

Code snippet
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.hywpu7b.mongodb.net/caresync?appName=Cluster0
Save and exit (Ctrl + O, Enter, then Ctrl + X).

Build the Next.js production bundle:

Bash
npm run build
Start and manage the background process using PM2:

Bash
pm2 start npm --name "caresync" -- start
pm2 save
pm2 startup
Configure Nginx as a reverse proxy:
Open the default Nginx site configuration:

Bash
sudo nano /etc/nginx/sites-available/default
Ensure the server block redirects port 80 traffic to the local Next.js instance on port 3000:

Nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
Verify and reload Nginx:

Bash
sudo nginx -t
sudo systemctl reload nginx
Access the live site:
Open http://<your-azure-vm-ip-or-dns> in your web browser.

## 📁 Project Directory Structure

```text
├── app/
│   ├── api/
│   │   ├── appointments/
│   │   │   ├── [id]/route.js       # Dynamic PUT, DELETE appointment endpoints
│   │   │   └── route.js            # GET all & validated POST appointment endpoints
│   │   ├── doctors/
│   │   │   ├── [id]/route.js       # Dynamic PUT, DELETE doctor endpoints
│   │   │   └── route.js            # GET all & POST doctor endpoints
│   │   └── patients/
│   │       ├── [id]/route.js       # Dynamic PUT, DELETE patient endpoints
│   │       └── route.js            # GET all & POST patient endpoints
│   ├── appointments/page.js        # Relational booking interface & validation modal
│   ├── doctors/page.js             # Staff roster with 7-day schedule selector
│   ├── patients/page.js            # Patient directory with allergy flags
│   ├── layout.js                   # Root shell & medical teal navigation
│   └── page.js                     # Central statistics dashboard
├── lib/
│   └── mongodb.js                  # Cached Mongoose connection handler
├── models/
│   ├── Appointment.js              # Relational appointment schema
│   ├── Doctor.js                   # Doctor schema
│   └── Patient.js                  # Patient schema
├── screenshots/                    # System interface screenshots
├── .env.local                      # Environment variables (excluded from Git)
└── package.json

