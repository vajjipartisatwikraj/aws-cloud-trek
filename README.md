# AWS Workshop - Student Registration System
## Deployment Ready Project

### 📁 Project Structure for AWS Deployment

```
MLRIT-AWS-workshop/
├── deployment/          # Files to upload to S3/EC2
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── api.php
│   ├── config.php
│   └── logo.png
│
├── Guide/              # Deployment documentation
│   ├── Instructions.md
│   ├── Install-Steps.txt
│   └── http-to-https.txt
│
└── README.md           # This file
```

---

## 🚀 AWS Deployment Steps

### **Prerequisites:**
- AWS Account
- Domain name (optional, for HTTPS)
- Basic AWS knowledge (EC2, RDS, S3, IAM)

---

### **Step 1: Create RDS Database**

1. Go to AWS RDS Console
2. Create MySQL database:
   - Engine: MySQL
   - Template: Free tier
   - DB instance: `aws-workshop-db`
   - Master username: `admin`
   - Master password: (set your password)
   - Database name: `aws_workshop`
3. Note the **Endpoint** URL

---

### **Step 2: Update Database Configuration**

Edit `deployment/config.php`:
```php
define('DB_HOST', 'your-rds-endpoint.rds.amazonaws.com');
define('DB_NAME', 'aws_workshop');
define('DB_USER', 'admin');
define('DB_PASS', 'your-password');
```

---

### **Step 3: Upload to S3**

1. Create S3 bucket (e.g., `my-workshop-files`)
2. Upload all files from `deployment/` folder
3. Files should be at bucket root level

---

### **Step 4: Launch EC2 Instance**

1. Launch Amazon Linux 2023 instance
2. Create IAM role with `AmazonS3FullAccess`
3. Attach IAM role to EC2
4. Configure Security Group:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)

---

### **Step 5: Install Software on EC2**

SSH into EC2 and run:
```bash
sudo dnf install httpd -y
sudo dnf install mariadb105 -y
sudo dnf install -y php php-mysqlnd php-cli php-common php-pdo php-mbstring php-xml
sudo systemctl enable httpd --now
```

---

### **Step 6: Copy Files from S3 to EC2**

```bash
cd /var/www/html/
sudo aws s3 sync s3://my-workshop-files/ /var/www/html/ --recursive
sudo chown -R apache:apache /var/www/html
sudo chmod -R 755 /var/www/html
```

---

### **Step 7: Configure RDS Security Group**

- Allow inbound MySQL (port 3306) from EC2 security group

---

### **Step 8: Test Website**

Visit: `http://YOUR-EC2-PUBLIC-IP`

---

### **Step 9: Setup Domain & HTTPS (Optional)**

See `Guide/Instructions.md` for detailed SSL setup with Certbot

---

## 🗂️ Files Description

### **Deployment Files:**
- `index.html` - Main webpage
- `style.css` - Styling
- `script.js` - Frontend JavaScript
- `api.php` - Backend API
- `config.php` - Database configuration
- `logo.png` - Logo image

### **Guide Files:**
- `Instructions.md` - Complete deployment guide
- `Install-Steps.txt` - Quick reference commands
- `http-to-https.txt` - SSL/HTTPS setup guide

---

## 🔧 Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** PHP 8.x
- **Database:** MySQL 8.0 (AWS RDS)
- **Server:** Apache (Amazon Linux 2023)
- **Cloud:** AWS (EC2, RDS, S3, IAM)

---

## 📝 Important Notes

1. **Security:** Never commit `config.php` with real credentials to GitHub
2. **Database:** Table `students` is auto-created on first page load
3. **Permissions:** Ensure Apache has read access to all files
4. **Firewall:** Configure Security Groups properly

---

## 🆘 Troubleshooting

**Database connection failed:**
- Check RDS endpoint in config.php
- Verify RDS security group allows EC2 access
- Confirm database name is `aws_workshop`

**Files not uploading:**
- Check IAM role has S3 access
- Verify bucket name in sync command

**Apache not serving files:**
- Check ownership: `apache:apache`
- Check permissions: `755`

---

## 👨‍💻 Author

**Aviz Academy** - AWS Workshop Demo Project

---

## 📄 License

Educational purposes only - AWS Workshop Training Material
