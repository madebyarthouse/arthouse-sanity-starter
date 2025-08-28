# Arthouse Sanity Starter React

A modern React Router v7 application with TypeScript, Tailwind CSS, and Sanity CMS integration.

## 🚀 Tech Stack

- **React Router v7** - Full-stack React framework
- **React 19** - Latest React features
- **TypeScript** - Type safety and better DX
- **Tailwind CSS v4** - Utility-first CSS framework
- **Sanity CMS** - Headless content management system
- **Vite** - Fast development and build tool
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **pnpm** - Fast package manager

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd arthouse-sanity-starter-react
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory:

   ```bash
   # Sanity Configuration
   VITE_SANITY_PROJECT_ID=your_project_id_here
   VITE_SANITY_DATASET=production
   VITE_SANITY_API_VERSION=2024-02-13
   VITE_SANITY_STUDIO_URL=http://localhost:3333

   # Preview Mode (Server-side only)
   SANITY_READ_TOKEN=your_read_token_here

   # Optional: Studio Preview Origin (for production)
   VITE_SANITY_STUDIO_PREVIEW_ORIGIN=https://your-domain.com
   ```

   **Required Variables:**
   - `VITE_SANITY_PROJECT_ID` - Your Sanity project ID
   - `VITE_SANITY_DATASET` - Your Sanity dataset (e.g., 'production', 'development')
   - `SANITY_READ_TOKEN` - Read token for preview mode (get from sanity.io/manage)

4. Start the development servers:

   ```bash
   # Start React Router app (http://localhost:5173)
   pnpm run dev

   # Start Sanity Studio (http://localhost:3333)
   pnpm run sanity:dev
   ```

## 🛠 Available Scripts

### React Router

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run typecheck` - Run TypeScript type checking

## 📁 Project Structure

```
├── app/                         # React Router app directory
│   ├── routes/                 # Route components
│   │   ├── api/               # API routes
│   │   │   └── preview-mode/  # Preview mode endpoints
│   │   ├── home.tsx          # Home page with house listings
│   │   └── house.$id.tsx     # Dynamic house detail pages
│   ├── components/            # Reusable components
│   │   ├── sanity-visual-editing.tsx  # Visual editing integration
│   │   └── ...               # Other components
│   ├── lib/                  # Shared utilities
│   │   └── sanity.ts        # Sanity client configuration
│   ├── sanity/              # Sanity integration
│   │   ├── schema/          # Schema definitions
│   │   ├── loader.server.ts # Server-side data loading
│   │   ├── preview.ts       # Preview mode logic
│   │   └── types.ts         # Generated TypeScript types
│   └── root.tsx             # Root component with SSR
├── public/                   # Static assets
├── sanity.config.ts         # Sanity Studio configuration
├── sanity.cli.ts           # Sanity CLI configuration
├── .env                    # Environment variables (not in git)
├── eslint.config.ts        # ESLint configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🎨 Styling

This project uses Tailwind CSS v4 for styling. The configuration is already set up and ready to use.

## 🗄️ Content Management

Sanity CMS is fully integrated with advanced features:

### Features

- **Studio URL**: http://localhost:3333 (development)
- **Visual Editing**: Edit content directly on your website
- **Preview Mode**: Preview draft content before publishing
- **Real-time Updates**: Content updates reflect immediately
- **Type Generation**: Automatic TypeScript types from schemas

### Schema & Content

- **Schema Types**: Define content models in `app/sanity/schema/`
- **Sample Schema**: `house.ts` with title, address, and bedrooms
- **Configuration**: Located in `sanity.config.ts`
- **Generated Types**: Available in `app/sanity/types.ts`

### Preview & Visual Editing

- **Preview URLs**: `/api/preview-mode/enable` and `/api/preview-mode/disable`
- **Visual Editing**: Click-to-edit functionality in preview mode
- **Secure Sessions**: Session-based preview authentication
- **Draft Content**: View unpublished changes in preview mode

## 🔧 Development

### Code Quality

- **ESLint** - Configured for React and TypeScript
- **Prettier** - Configured with Tailwind CSS plugin for class sorting
- **TypeScript** - Strict mode enabled for better type safety

### React Router 7 Integration

This starter leverages React Router 7's powerful features:

**Server-Side Rendering (SSR):**

- Data loading with `loader` functions
- Automatic hydration and client-side navigation
- SEO-friendly routing with meta tags

**Route Organization:**

- File-based routing in `app/routes/`
- Dynamic routes (e.g., `house.$id.tsx`)
- API routes for backend functionality

**Type Safety:**

- Auto-generated route types
- Type-safe loaders and actions
- Full TypeScript integration

**Performance:**

- Automatic code splitting
- Optimized bundle sizes
- Fast page transitions

### Environment Variables

The following environment variables are required:

**Public Variables (accessible in browser):**

- `VITE_SANITY_PROJECT_ID` - Your Sanity project ID
- `VITE_SANITY_DATASET` - Your Sanity dataset name
- `VITE_SANITY_API_VERSION` - Sanity API version (defaults to 2024-02-13)
- `VITE_SANITY_STUDIO_URL` - Sanity Studio URL for visual editing

**Private Variables (server-side only):**

- `SANITY_READ_TOKEN` - Read token for preview mode access

**Optional Variables:**

- `VITE_SANITY_STUDIO_PREVIEW_ORIGIN` - Production domain for studio previews

## 🚢 Deployment

Build the project for production:

```bash
pnpm run build
```

The build artifacts will be stored in the `build/` directory.

For Sanity Studio deployment:

```bash
pnpm run sanity:deploy
```

## 📚 Useful Links

- [React Router v7 Documentation](https://reactrouter.com)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ✅ Todo

- [ ] Create `.env.example` file with all required environment variables
- [ ] Remove console.log from production code (`app/root.tsx`)
- [ ] Implement persistent session secret for preview mode
- [ ] Add more robust Sanity schema fields (images, price, description)
- [ ] Add error boundaries for better error handling
- [ ] Implement data caching strategies
- [ ] Add unit tests for components and utilities

## 📝 License

This project is licensed under the MIT License.
