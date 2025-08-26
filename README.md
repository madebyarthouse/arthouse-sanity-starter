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
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Sanity project details:
   - `SANITY_PROJECT_ID` - Your Sanity project ID
   - `SANITY_DATASET` - Your Sanity dataset (e.g., 'production', 'development')

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

### Sanity CMS
- `pnpm run sanity:dev` - Start Sanity Studio development server
- `pnpm run sanity:build` - Build Sanity Studio for production
- `pnpm run sanity:deploy` - Deploy Sanity Studio

## 📁 Project Structure

```
├── app/                    # React Router app directory
│   ├── routes/            # Route components
│   ├── components/        # Reusable components
│   └── root.tsx          # Root component
├── schemaTypes/           # Sanity schema definitions
├── public/                # Static assets
├── sanity.config.ts       # Sanity configuration
├── sanity.cli.ts         # Sanity CLI configuration
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment variables template
├── eslint.config.ts      # ESLint configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🎨 Styling

This project uses Tailwind CSS v4 for styling. The configuration is already set up and ready to use.

## 🗄️ Content Management

Sanity CMS is integrated for content management:

- **Studio URL**: http://localhost:3333 (development)
- **Schema Types**: Define your content models in `schemaTypes/`
- **Configuration**: Located in `sanity.config.ts`

## 🔧 Development

### Code Quality

- **ESLint** - Configured for React and TypeScript
- **Prettier** - Configured with Tailwind CSS plugin for class sorting
- **TypeScript** - Strict mode enabled for better type safety

### Environment Variables

The following environment variables are required:

- `SANITY_PROJECT_ID` - Your Sanity project ID
- `SANITY_DATASET` - Your Sanity dataset name

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

- [ ] Review and proofread Claude code and Cursor rules configuration files

## 📝 License

This project is licensed under the MIT License.