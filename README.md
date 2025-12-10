# Toolkit SaaS

A modern, full-stack SaaS application for PDF processing built with Next.js and FastAPI. Process PDFs with ease - compress, merge, convert, view, and extract text from PDF documents.

## 🚀 Features

- **Compress PDF** - Reduce PDF file size while maintaining quality
- **Merge PDFs** - Combine multiple PDF files into a single document
- **PDF to Image** - Convert PDF pages to PNG or JPG images
- **Image to PDF** - Convert multiple images into a single PDF document
- **View PDF** - View PDF files with browser's built-in controls (zoom, print, download)
- **Extract Text** - Extract text from PDFs and images with OCR support
- 🎨 Clean, modern SaaS-style interface
- 📤 Drag & drop file upload
- 📊 Real-time progress indicators
- 📱 Fully responsive design

## 🛠️ Tech Stack

**Frontend:** Next.js 14, TypeScript, TailwindCSS, Axios  
**Backend:** FastAPI (Python), pypdf, pillow, pdf2image, reportlab, pytesseract

## 🚦 Quick Start with Docker

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running

### Run the Application

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/toolkit-saas.git
   cd toolkit-saas
   ```

2. **Start with Docker Compose**
   ```bash
   docker compose up --build
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8005
   - **API Docs**: http://localhost:8005/docs

### Stop the Application

```bash
docker compose down
```

That's it! No manual dependency installation needed.

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/pdf/compress` | POST | Compress PDF file |
| `/pdf/merge` | POST | Merge multiple PDFs |
| `/pdf/pdf-to-image` | POST | Convert PDF to images |
| `/pdf/image-to-pdf` | POST | Convert images to PDF |
| `/pdf/extract-text` | POST | Extract text from PDF/image |

Full API documentation available at: http://localhost:8005/docs

## 🎯 Usage

1. Open http://localhost:3000 in your browser
2. Select a tool from the sidebar (Compress, Merge, PDF to Image, etc.)
3. Drag & drop files or click to browse
4. Click process and download the result

## 📁 Project Structure

```
toolkit-saas/
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── routers/
│   │   │   └── pdf.py               # PDF processing endpoints
│   │   └── utils/
│   │       ├── pdf_helpers.py       # PDF processing utilities
│   │       └── file_helpers.py      # File management utilities
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Backend Docker configuration
│   └── .env.example                 # Environment template
│
├── frontend/                         # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Landing page
│   │   │   └── dashboard/           # Main application
│   │   │       ├── compress/        # Compress PDF tool
│   │   │       ├── merge/           # Merge PDFs tool
│   │   │       ├── pdf-to-image/    # PDF to Image converter
│   │   │       ├── image-to-pdf/    # Image to PDF converter
│   │   │       └── extract-text/    # Text extraction with OCR
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   ├── FileUpload.tsx       # Drag & drop file upload
│   │   │   └── Sidebar.tsx          # Dashboard navigation
│   │   ├── lib/
│   │   │   └── api.ts               # Axios API client
│   │   └── store/
│   │       └── authStore.ts         # Zustand state management
│   ├── package.json                 # Dependencies and scripts
│   ├── Dockerfile                   # Frontend Docker configuration
│   └── .env.example                 # Environment template
│
├── docker-compose.yml               # Docker orchestration
├── .dockerignore                    # Docker ignore patterns
├── DOCKER_SETUP.md                  # Detailed Docker guide
└── README.md                        # This file
```

## 🌍 Environment Variables

### Backend (.env)

```env
# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Optional: Database (if implementing authentication)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8005
```

### Docker Environment

Environment variables are pre-configured in `docker-compose.yml`:
- Backend: `PYTHONUNBUFFERED=1`
- Frontend: `NEXT_PUBLIC_API_URL=http://localhost:8005`

No manual configuration needed for Docker setup!

## 📥 System Dependencies (Optional - For Local Development)

**Note:** If using Docker, all dependencies are pre-installed in the containers. Only install these if running without Docker.

### Poppler (Required for PDF to Image)

**macOS:**
```bash
brew install poppler
```

**Ubuntu/Debian:**
```bash
sudo apt-get install poppler-utils
```

**Windows:**
Download from [Poppler for Windows](http://blog.alivate.com.au/poppler-windows/) and add to PATH

**Verify:**
```bash
which pdftoppm
```

### Tesseract OCR (Required for Image Text Extraction)

**macOS:**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

**Windows:**
Download from [Tesseract GitHub](https://github.com/UB-Mannheim/tesseract/wiki)

**Verify:**
```bash
which tesseract
```

### Ghostscript (Optional - Better PDF Compression)

**macOS:**
```bash
brew install ghostscript
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ghostscript
```

**Windows:**
Download from [Ghostscript Downloads](https://www.ghostscript.com/download/gsdnld.html)

**Verify:**
```bash
which gs
```

## 🔧 Development Commands

### Docker Development
```bash
# Start in development mode
docker compose up

# Rebuild after code changes
docker compose up --build

# Run in background
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down

# Clean everything (containers, volumes, images)
docker compose down -v
docker system prune -a
```

### Backend Development (inside container)
```bash
# Access backend container
docker compose exec backend bash

# Format code
black app/

# Type checking
mypy app/
```

### Frontend Development (inside container)
```bash
# Access frontend container
docker compose exec frontend sh

# Lint code
npm run lint
```

## 🚀 Deployment

### Docker Hub
```bash
# Build and tag images
docker compose build
docker tag toolkit-saas-backend yourusername/toolkit-backend:latest
docker tag toolkit-saas-frontend yourusername/toolkit-frontend:latest

# Push to Docker Hub
docker push yourusername/toolkit-backend:latest
docker push yourusername/toolkit-frontend:latest
```

### Cloud Platforms

**Render / Railway / Fly.io:**
1. Push code to GitHub
2. Connect repository to platform
3. Platform will auto-detect Docker configuration
4. Deploy automatically

**Vercel (Frontend) + Render (Backend):**
1. Deploy frontend to Vercel
2. Deploy backend to Render using Docker
3. Update `NEXT_PUBLIC_API_URL` environment variable

## 🔒 Security Considerations

- ✅ File validation on upload
- ✅ Temporary file cleanup (auto-cleanup every 30 minutes)
- ✅ CORS configuration
- ⚠️ Add rate limiting in production
- ⚠️ Implement file size limits
- ⚠️ Use HTTPS in production
- ⚠️ Sanitize file names
- ⚠️ Add authentication for sensitive operations
- ⚠️ Set up environment variables properly
- ⚠️ Use secrets management for production

## 🐛 Troubleshooting

### Docker Issues

**Docker daemon not running:**
- Start Docker Desktop application
- Wait for Docker to fully start (check menu bar icon)

**Port already in use:**
- Stop other services on ports 3000 or 8005
- Or modify ports in `docker-compose.yml`:
  ```yaml
  ports:
    - "3001:3000"  # Frontend
    - "8006:8000"  # Backend
  ```

**Build errors:**
```bash
docker compose down
docker compose up --build
```

**Container keeps restarting:**
```bash
# Check logs
docker compose logs backend
docker compose logs frontend

# Common issues:
# - Missing dependencies (rebuild with --build)
# - Port conflicts (change ports)
# - File permission issues (check volumes)
```

**Out of disk space:**
```bash
# Clean up Docker
docker system prune -a
docker volume prune
```

### Application Issues

**API Connection Error:**
- Verify both containers are running: `docker compose ps`
- Check backend logs: `docker compose logs backend`
- Ensure CORS settings allow frontend URL

**File Upload Fails:**
- Check file size (default limit may apply)
- Verify file format is supported
- Check backend logs for errors

**PDF Processing Errors:**
- All dependencies (Poppler, Tesseract) are included in Docker image
- Check backend logs for specific error messages

## 📦 Dependencies

### Backend
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `python-multipart` - File upload handling
- `pypdf` - PDF manipulation
- `pillow` - Image processing
- `pdf2image` - PDF to image conversion
- `reportlab` - PDF generation
- `pytesseract` - OCR text extraction
- `aiofiles` - Async file operations

### Frontend
- `next` - React framework (v14)
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `axios` - HTTP client
- `zustand` - State management
- `lucide-react` - Icons
- `react-hot-toast` - Notifications

### System (Docker Image)
- `poppler-utils` - PDF to image conversion
- `tesseract-ocr` - OCR text extraction

## 🎨 Features Roadmap

- [ ] Batch file processing
- [ ] PDF splitting by page range
- [ ] Watermark addition
- [ ] PDF encryption/decryption
- [ ] Page rotation and reordering
- [ ] Cloud storage integration (S3, Google Drive)
- [ ] Email delivery of processed files
- [ ] User accounts and file history
- [ ] API rate limiting
- [ ] Payment integration (Stripe)
- [ ] PDF form filling
- [ ] Digital signatures
- [ ] Collaborative editing

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test with Docker**
   ```bash
   docker compose up --build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure Docker build works
- Keep commits atomic and descriptive

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Provide detailed error logs when reporting bugs

---

**Built with ❤️ using Next.js and FastAPI**
