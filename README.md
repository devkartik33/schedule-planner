# Schedule Planner

A full-stack web application for schedule planning with modern REST API and intuitive user interface.

## 🚀 Technologies

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **Alembic** - Database migration system
- **Pydantic** - Data validation and serialization
- **SQLite/PostgreSQL** - Database
- **Uvicorn** - ASGI server

### Frontend
- **React** - User interface library
- **Vite** - Build tool and development server
- **Shadcn UI** - Styling
- **React Big Calendar** - Calendar

### DevOps
- **Docker & Docker Compose** - Containerization
- **Git** - Version control system

## 📁 Project Structure

```
schedule-planner/
├── 📂 backend/                    # Server-side (FastAPI)
│   ├── 📂 app/                    # Main application code
│   │   ├── 📂 models/             # Database models (SQLAlchemy)
│   │   │   ├── __init__.py
│   │   │   ├── user.py            # User model
│   │   │   ├── schedule.py        # Schedule model
│   │   │   ├── lesson.py          # Lesson/class model
│   │   │   ├── room.py            # Room model
│   │   │   ├── subject.py         # Subject model
│   │   │   ├── group.py           # Group model
│   │   │   ├── faculty.py         # Faculty model
│   │   │   └── ...                # Other models
│   │   ├── 📂 schemas/            # Pydantic schemas for API
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── schedule.py
│   │   │   ├── lesson.py
│   │   │   └── ...
│   │   ├── 📂 routes/             # API routes
│   │   │   ├── __init__.py
│   │   │   ├── auth.py            # Authentication
│   │   │   ├── schedule.py        # Schedule API
│   │   │   ├── user.py            # User API
│   │   │   └── ...
│   │   ├── 📂 repositories/       # Data access layer
│   │   ├── 📂 services/           # Business logic
│   │   ├── 📂 utils/              # Utilities
│   │   ├── config.py              # Application configuration
│   │   ├── database.py            # Database setup
│   │   └── dependencies.py        # FastAPI dependencies
│   ├── 📂 migrations/            # Alembic migrations
│   │   ├── 📂 versions/           # Migration files
│   │   ├── env.py                 # Alembic configuration
│   │   └── ...
│   ├── main.py                   # Application entry point
│   ├── requirements.txt          # Python dependencies
│   ├── alembic.ini               # Alembic configuration
│   ├── Dockerfile                # Backend Docker image
│   ├── entrypoint.sh             # Startup script with migrations
│   └── .env.example              # Environment variables example
├── 📂 frontend/                   # Client-side
│   ├── 📂 src/                    # Source code
│   │   ├── 📂 components/         # React components
│   │   ├── 📂 pages/              # Application pages
│   │   ├── 📂 hooks/              # Custom hooks
│   │   ├── 📂 contexts/           # React contexts
│   │   ├── 📂 lib/                # Utilities and libraries
│   │   ├── 📂 assets/             # Static resources
│   │   ├── App.jsx                # Main component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── 📂 public/                 # Public files
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── Dockerfile                # Frontend Docker image
│   └── .env.example              # Environment variables example
├── docker-compose.yml            # Container orchestration
├── .gitignore                    # Git ignored files
├── LICENSE                       # Project license
└── README.md                     # Project documentation
```

## ⚡ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT tokens for secure authentication
- Role-based access control

### 🎓 Academic Structure
- Manage faculties, directions and study forms
- Create and edit student groups
- Manage subjects and assignments
- Manage personal users information
- Track teacher contracts and workloads

### 🏢 Resources
- Create and manage academic years and semesters
- Manage classrooms and their characteristics

### 📊 Schedule Management
- Create and edit schedules
- Manage lessons and classes
- Assign rooms and teachers

### 📈 Reports & Analytics
- Export schedules in Excel and PDF formats
- Detect and resolve various types of scheduling conflicts
- Monitor and prevent workload hour limit violations 

## 🛠️ Prerequisites

### For Docker deployment (recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Windows
- Git for repository cloning

### For local development
- **Python 3.10+** ([download](https://www.python.org/downloads/))
- **Node.js 18+** and npm ([download](https://nodejs.org/))
- **Git** ([download](https://git-scm.com/downloads))

## 🚀 Quick Start

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/schedule-planner.git
cd schedule-planner
```

### 2️⃣ Docker Deployment (Recommended)

#### Setup Environment Files
```bash
# Backend environment
copy backend\.env.example backend\.env
# Edit backend/.env with your settings
```

#### Run Application
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

### 3️⃣ Local Development

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Setup environment
copy .env.example .env
# Edit .env file with your database settings

# Run database migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Security & Authentication
ACCESS_SECRET_KEY=your-access-secret-key-here
REFRESH_SECRET_KEY=your-refresh-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
SQLALCHEMY_DATABASE_URL=sqlite:///data.db

# Initial Admin User
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=your-secure-password

# Database reset and populate with initial data (if you need) 
RESET_DB_ON_START=true
```

## 🗄️ Database Migrations

The application uses Alembic for database migrations:

- **Automatic migrations:** Run automatically in Docker
- **Manual migrations:** Use `alembic upgrade head` for local development
- **Create migration:** `alembic revision --autogenerate -m "description"`
- **Migration files:** Stored in `backend/alembic/versions/`

## 📚 API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [API documentation](http://localhost:8000/docs)
2. Review the logs: `docker-compose logs -f`
3. Open an issue on GitHub
4. Check existing issues for solutions

## 🎯 Roadmap

- [ ] Mobile application
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] Multi-language support

---

**Happy Scheduling! 📅✨**
