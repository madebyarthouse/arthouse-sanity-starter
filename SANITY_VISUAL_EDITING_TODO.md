# Sanity Visual Editing Implementation Todo

Based on the [Sanity Visual Editing guide for React Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-react-router), here's a comprehensive implementation plan for your arthouse-sanity-starter-react project.

## 📋 Implementation Checklist

### 1. Dependencies Installation
- [ ] Install required packages: `@sanity/visual-editing`, `@sanity/preview-url-secret`, `@sanity/react-loader`
- [ ] Verify existing Sanity client dependency

### 2. Environment Configuration
- [ ] Create `.env` file with all required environment variables
- [ ] Configure public and private Sanity environment variables
- [ ] Set up Studio URL configuration

### 3. Client Configuration Updates
- [ ] Update `app/lib/sanity.ts` to support stega encoding and studio URL
- [ ] Configure client for both browser and server environments
- [ ] Add proper TypeScript declarations for window.ENV

### 4. Preview Mode Infrastructure
- [ ] Create `app/sanity/preview.ts` helper for session management
- [ ] Implement cookie-based session storage for preview state
- [ ] Set up preview context function with proper typing

### 5. Server-Side Loading Setup
- [ ] Create `app/sanity/loader.server.ts` for loadQuery functionality
- [ ] Configure server client with proper token handling
- [ ] Set up proper server-only imports

### 6. API Routes Creation
- [ ] Create `app/routes/api/preview-mode/enable.ts` endpoint
- [ ] Create `app/routes/api/preview-mode/disable.ts` endpoint
- [ ] Update `app/routes.ts` to include new API routes
- [ ] Implement proper URL validation and security

### 7. React Components
- [ ] Create `app/components/DisablePreviewMode.tsx` component
- [ ] Create `app/components/SanityVisualEditing.tsx` wrapper
- [ ] Implement conditional rendering logic for preview mode

### 8. Root Layout Updates
- [ ] Update `app/root.tsx` with preview mode loader
- [ ] Add environment variables to client-side window object
- [ ] Conditionally render Visual Editing components
- [ ] Maintain existing Plausible Analytics integration

### 9. Sanity Studio Configuration
- [ ] Update `sanity.config.ts` with presentationTool plugin
- [ ] Configure preview URLs for development and production
- [ ] Set up proper environment variable handling

### 10. Route Updates
- [ ] Update `app/routes/home.tsx` to use loadQuery pattern
- [ ] Implement useQuery hook for live preview updates
- [ ] Add data attributes for enhanced overlay support
- [ ] Maintain existing functionality while adding preview capabilities

### 11. Testing & Validation
- [ ] Test preview mode enable/disable functionality
- [ ] Verify Visual Editing overlays appear correctly
- [ ] Test live updates in Presentation tool
- [ ] Validate both published and draft content rendering

## 🔧 Technical Considerations

### Current Project Analysis
- ✅ React Router v7 already configured
- ✅ Sanity client already set up in `app/lib/sanity.ts`
- ✅ Basic Sanity configuration exists
- ✅ TypeScript and modern tooling in place
- ⚠️ No environment file currently exists
- ⚠️ Visual Editing dependencies not installed
- ⚠️ No preview mode infrastructure

### Key Implementation Notes
1. **Environment Variables**: Need to create `.env` file with proper Sanity configuration
2. **Session Security**: Using crypto.randomBytes for session secrets (Vite compatible)
3. **TypeScript Support**: Proper typing for all new components and functions
4. **Backward Compatibility**: Maintain existing functionality while adding preview features
5. **Performance**: Implement proper client/server separation for optimal loading

## 🚀 Getting Started

1. Start with dependency installation and environment setup
2. Configure the Sanity client for Visual Editing
3. Implement preview mode infrastructure
4. Create necessary API routes and components
5. Update root layout and existing routes
6. Configure Sanity Studio with presentation tool
7. Test the complete implementation

## 📝 Notes
- This implementation follows React Router v7 patterns
- Maintains compatibility with existing Plausible Analytics
- Uses modern TypeScript and React 19 features
- Implements proper security measures for preview sessions
- Follows Sanity's recommended best practices for Visual Editing
