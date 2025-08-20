# 🧞‍♂️ LegalGenie V4

An AI-powered legal document generator with intelligent chat assistant, built with Next.js 15, React 19, and cutting-edge AI technology.

## ✨ Features

### 🤖 AI Document Generation
- **Smart Legal Documents**: Generate contracts, agreements, and legal documents using Google Gemini AI
- **Customizable Templates**: Tailored prompts for different legal document types
- **Instant Generation**: Fast AI-powered document creation with professional formatting

### 💬 Legal Chat Assistant  
- **Real-time AI Consultation**: Ask legal questions and get instant AI-powered responses
- **Context-aware Conversations**: Maintains conversation history for better assistance
- **Session Management**: Organized chat sessions for different legal topics

### 📁 Document Management
- **Folder Organization**: Create and manage folders to organize your documents
- **Document Library**: View, edit, and manage all your generated documents
- **Smart Filtering**: Filter by document type, status, favorites, and search content
- **Export Options**: Download documents as PDF or TXT files

### 🔐 User Authentication
- **Secure Login**: Supabase authentication with email verification
- **User Profiles**: Personal document libraries and chat history
- **Session Management**: Persistent login across browser sessions

### 🎨 Beautiful UI/UX
- **Modern Design**: Clean, professional interface using Radix UI + Tailwind CSS
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Adaptive theme support
- **Smooth Animations**: Polished user experience with micro-interactions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Beautiful component library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - Authentication and PostgreSQL database
- **Google Gemini AI** - Advanced AI for document generation and chat

### Database
- **PostgreSQL** (via Supabase)
- **Row Level Security** - Secure data isolation
- **Real-time subscriptions** - Live data updates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI Studio account (for Gemini API)

### 1. Clone the Repository
```bash
git clone https://github.com/Harsith-Thokala/LegalGenie.git
cd LegalGenie
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Database Setup
1. Create a new Supabase project
2. Run the SQL script from `supabase-setup.sql` in your Supabase SQL editor
3. This will create all necessary tables, policies, and functions

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### Core Tables
- **profiles** - User profile information
- **folders** - Document organization folders
- **documents** - Generated legal documents
- **chat_sessions** - Chat conversation sessions
- **chat_messages** - Individual chat messages

### Security
- Row Level Security (RLS) enabled on all tables
- User data isolation through policies
- Secure API key management

## 🔧 API Endpoints

### Documents
- `GET /api/documents` - Fetch user documents
- `POST /api/documents` - Create new document (via generation)
- `PUT /api/documents/[id]` - Update document
- `DELETE /api/documents/[id]` - Delete document

### Folders
- `GET /api/folders` - Fetch user folders
- `POST /api/folders` - Create new folder
- `DELETE /api/folders/[id]` - Delete folder

### AI Generation
- `POST /api/generate/document` - Generate legal document
- `POST /api/chat/message` - Send chat message
- `POST /api/chat/sessions` - Create chat session

## 🎯 Key Features in Detail

### Document Generation
- Intelligent prompt engineering for legal documents
- Support for various document types (contracts, agreements, etc.)
- Automatic word count and preview generation
- Real-time status tracking

### Folder Management
- Color-coded folder organization
- Drag-and-drop document management
- Automatic document count tracking
- Nested folder support

### Chat Assistant
- Context-aware conversations
- Legal knowledge base integration
- Session-based chat history
- Real-time response streaming

## 🔒 Security Features

- **Environment Variable Protection** - Sensitive keys properly secured
- **Row Level Security** - Database-level access control
- **Authentication Required** - Protected routes and API endpoints
- **Input Validation** - Sanitized user inputs
- **HTTPS Only** - Secure communication

## 📱 Responsive Design

- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Mobile gesture support
- **Fast Loading** - Optimized bundle sizes
- **Offline Support** - Service worker for offline functionality

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Harsith Thokala**
- GitHub: [@Harsith-Thokala](https://github.com/Harsith-Thokala)
- LinkedIn: [Connect with me](https://linkedin.com/in/harsith-thokala)

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful document generation
- **Supabase** for seamless backend infrastructure
- **Vercel** for excellent deployment platform
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for beautiful styling system

## 📊 Project Stats

- **93+ Files** - Comprehensive codebase
- **14,866+ Lines** - Extensive functionality
- **Type-Safe** - 100% TypeScript coverage
- **Modern Stack** - Latest React and Next.js features
- **Production Ready** - Fully functional AI application

---

⭐ **Star this repository if you find it helpful!**

🐛 **Found a bug? Please open an issue.**

💡 **Have a feature request? Let's discuss it!**
