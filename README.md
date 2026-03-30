# Portfolio Web Application

A modern, full-stack, fully responsive Portfolio Web Application built with Next.js 14, Tailwind CSS, Framer Motion, and TypeScript. Features a beautiful dark/light mode toggle with distinct button designs for each theme.

![Portfolio Preview](./preview.png)

## ✨ Features

- **Modern Tech Stack**: Next.js 14 (App Router), Tailwind CSS v3, TypeScript, Framer Motion
- **Dark/Light Mode**: Distinct button designs for each mode with smooth animations
- **Fully Responsive**: Optimized for mobile (320px), tablet (768px), and desktop (1280px+)
- **Smooth Animations**: Scroll-triggered animations, typing effects, hover effects
- **Interactive Components**: Project filtering, animated counters, form validation
- **SEO Optimized**: Proper meta tags, Open Graph, Twitter cards
- **FastAPI Backend**: Optional backend for contact form email sending

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+ (optional, for backend)

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd portfolio-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup (Optional)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   # Copy the example env file
   cp .env.example .env

   # Edit .env with your SMTP credentials
   ```

5. **Start the backend server**:
   ```bash
   python main.py
   # or
   uvicorn main:app --reload
   ```

6. **API Documentation**:
   Navigate to [http://localhost:8000/docs](http://localhost:8000/docs)

## 📁 Project Structure

```
portfolio-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SEO
│   │   ├── page.tsx            # Main page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── Hero.tsx            # Hero section
│   │   ├── About.tsx           # About section
│   │   ├── Skills.tsx          # Skills section
│   │   ├── Projects.tsx        # Projects section
│   │   ├── Timeline.tsx        # Experience timeline
│   │   ├── Contact.tsx         # Contact form
│   │   ├── Footer.tsx          # Footer
│   │   ├── ThemeToggle.tsx     # Theme switcher
│   │   ├── AnimatedCounter.tsx # Counter animation
│   │   ├── ProjectCard.tsx     # Project card
│   │   └── SkillBar.tsx        # Skill components
│   ├── data/
│   │   ├── projects.ts         # Projects data
│   │   ├── skills.ts           # Skills data
│   │   └── experience.ts       # Experience data
│   ├── hooks/
│   │   └── useScrollDirection.ts # Scroll direction hook
│   └── providers/
│       └── ThemeProvider.tsx   # Theme provider
└── public/                     # Static assets

backend/
├── main.py                     # FastAPI application
├── requirements.txt            # Python dependencies
└── .env.example                # Environment variables template
```

## 🎨 Customization

### Personal Information

Update the following files with your information:

1. **`src/data/projects.ts`**: Your projects
2. **`src/data/skills.ts`**: Your skills and proficiency levels
3. **`src/data/experience.ts`**: Your work experience and education
4. **`src/app/layout.tsx`**: Your name, email, social links for SEO
5. **`src/components/Hero.tsx`**: Your name and bio
6. **`src/components/About.tsx`**: Your personal information
7. **`src/components/Contact.tsx`**: Your contact details

### Theme Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
theme: {
  extend: {
    colors: {
      // Your custom colors
    },
  },
}
```

### Images

Add your images to the `public/` folder:
- `mypic.png` - Profile picture
- `projects/` - Project screenshots
- `og-image.png` - Social sharing image

## 🛠️ Available Scripts

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend

```bash
python main.py       # Start development server
uvicorn main:app     # Start with uvicorn
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1279px
- **Large Desktop**: 1280px+

## 🎯 Features Breakdown

### Navbar
- Logo/Name on left
- Navigation links with active state
- Distinct dark/light mode toggle buttons
- Mobile hamburger menu with animated drawer
- Hide on scroll down, show on scroll up

### Hero Section
- Animated typing effect for role titles
- Gradient text for name
- Two CTA buttons with hover effects
- Animated background particles
- Social media links

### About Section
- Profile image with animated border ring
- Quick stats with animated counters
- Personal description

### Skills Section
- Categorized skills (Frontend, Backend, Tools)
- Animated skill cards with progress bars
- Hover effects

### Projects Section
- Grid layout with filtering
- Project cards with hover overlays
- Tech stack badges
- GitHub and Live Demo links

### Timeline Section
- Vertical animated timeline
- Work experience and education entries
- Alternating layout

### Contact Section
- Form validation with error messages
- Loading state on submit
- Contact info cards
- Social media icons

## 🔧 Environment Variables

### Backend (.env)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
TO_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:3000
```

## 📦 Dependencies

### Frontend
- `next` - React framework
- `react` - UI library
- `framer-motion` - Animations
- `next-themes` - Theme management
- `lucide-react` - Icons
- `tailwindcss` - Styling

### Backend
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `python-dotenv` - Environment variables
- `pydantic` - Data validation

## 🌐 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy

### Backend (Railway/Render)

1. Create new Python project
2. Connect GitHub repository
3. Set environment variables
4. Deploy

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Muhammad Uzair**
- GitHub: [@ucdexpert](https://github.com/ucdexpert)
- LinkedIn: [muhammad-uzair-9255433a0](https://www.linkedin.com/in/muhammad-uzair-9255433a0/)
- X (Twitter): [@UzairKhilj60869](https://x.com/UzairKhilj60869)
- Instagram: [@uzairkhilji.uzairkhilji](https://www.instagram.com/uzairkhilji.uzairkhilji/)
- Facebook: [uzairkhilji.uzairkhilji](https://www.facebook.com/uzairkhilji.uzairkhilji/)
- Email: hk202504@gmial.com
- Phone: +92 317 0219387
- Location: Karachi, Pakistan

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js, Tailwind CSS, and Framer Motion
