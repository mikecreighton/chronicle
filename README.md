# Chronicle 📚

A simple, engaging single-page dashboard for tracking book reading progress throughout the school year. Designed specifically for young readers to visually track their progress toward their yearly reading goals.

## ✨ Features

- **Goal Setting**: Set and visualize progress toward a yearly book reading goal
- **Book Management**: Add, edit, and track books with three states (Planned → Reading → Completed)
- **Simultaneous Reading**: Support for reading multiple books at the same time
- **Drag & Drop**: Reorder your reading list with intuitive drag-and-drop
- **Inline Editing**: Edit book titles directly in the interface
- **Progress Visualization**: Clear progress indicators showing books completed vs. goal
- **Real-time Sync**: Changes sync instantly across devices with [Convex](https://www.convex.dev/)

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ with App Router & React 19
- **Database**: Convex (real-time backend)
- **Styling**: Tailwind CSS v4
- **Interactions**: [DND Kit](https://dndkit.com/) for drag-and-drop functionality
- **Language**: TypeScript
- **Deployment**: Docker-ready with Vercel support

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Convex account (free tier available)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chronicle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.local.example .env.local
   # Add your Convex deployment URL to .env.local
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   This runs both the Next.js frontend (`npm run dev:frontend`) and Convex backend (`npm run dev:backend`) in parallel.

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
chronicle/
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   │   ├── BookCard.tsx    # Individual book display/edit
│   │   ├── BookList.tsx    # Container for all books
│   │   ├── DraggableBook.tsx # Drag-and-drop book wrapper
│   │   ├── EmptySlot.tsx   # Placeholder slots
│   │   ├── GoalSetter.tsx  # Goal setting interface
│   │   └── ProgressDisplay.tsx # Progress visualization
│   ├── layout.tsx          # Root layout with Convex provider
│   └── page.tsx           # Main dashboard
└── convex/                # Convex backend
    ├── books.ts           # Book mutations and queries
    ├── settings.ts        # Settings management  
    └── schema.ts          # Database schema
```

## 📊 Data Model

The app uses Convex with the following schema:

```typescript
// Books table
books: {
  title: string,           // Book title (can be empty for placeholders)
  status: "planned" | "reading" | "completed",
  order: number,           // For drag-and-drop ordering
  startedAt?: number,      // Timestamp when reading started
  completedAt?: number,    // Timestamp when completed
}

// Settings table  
settings: {
  yearGoal: number,        // Target number of books for the year
  schoolYear: string,      // e.g., "2024-2025"
}
```

## 🎯 User Flow

1. **Set Your Goal**: Open Settings and choose how many books you want to read this school year
2. **Plan Your List**: Add book titles to your reading list (or leave slots empty for future discoveries)
3. **Start Reading**: Mark books as "Reading" when you begin them
4. **Complete Books**: Mark books as "Completed" to see your progress grow
5. **Track Progress**: Watch your progress bar fill up as you work toward your goal

## 🎨 Design Philosophy

- **Single Page**: Everything happens on one dashboard - no complex navigation
- **Visual First**: Clear visual states and immediate feedback for all actions
- **Mobile Friendly**: Works great on phones, tablets, and desktops

## 📝 Available Scripts

- `npm run dev` - Start both frontend and backend development servers
- `npm run dev:frontend` - Start only the Next.js development server
- `npm run dev:backend` - Start only the Convex development server  
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🐳 Docker Support

The project includes a Dockerfile for containerized deployment:

```bash
docker build -t chronicle .
docker run -p 3000:3000 chronicle
```

## 🚀 Deployment

Ready to deploy to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Self-hosted** with Docker
- **Any Node.js hosting platform**

Make sure to set up your Convex deployment and environment variables in your hosting platform. Official docs:

- [Vercel](https://docs.convex.dev/production/hosting/vercel)
- [Netlify](https://docs.convex.dev/production/hosting/netlify)
- [Custom Domains & Hosting](https://docs.convex.dev/production/hosting/custom)

## 📄 License

[Apache License 2.0](https://spdx.org/licenses/Apache-2.0.html)
