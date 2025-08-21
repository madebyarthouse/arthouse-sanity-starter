# Arthouse Sanity Starter React

A modern React Router v7 application with TypeScript, Tailwind CSS, and best practices.

## 🚀 Tech Stack

- **React Router v7** - Full-stack React framework
- **React 19** - Latest React features
- **TypeScript** - Type safety and better DX
- **Tailwind CSS v4** - Utility-first CSS framework
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

3. Start the development server:
   ```bash
   pnpm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run typecheck` - Run TypeScript type checking

## 📁 Project Structure

```
├── app/                    # React Router app directory
│   ├── routes/            # Route components
│   ├── components/        # Reusable components
│   └── root.tsx          # Root component
├── public/                # Static assets
├── .cursorrules          # AI assistant configuration
├── .prettierrc           # Prettier configuration
├── eslint.config.ts      # ESLint configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🎨 Styling

This project uses Tailwind CSS v4 for styling. The configuration is already set up and ready to use.

## 🔧 Development

### Code Quality

- **ESLint** - Configured for React and TypeScript
- **Prettier** - Configured with Tailwind CSS plugin for class sorting
- **TypeScript** - Strict mode enabled for better type safety

### Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

## 🚢 Deployment

Build the project for production:

```bash
pnpm run build
```

The build artifacts will be stored in the `build/` directory.

## 📝 License

This project is licensed under the MIT License.
