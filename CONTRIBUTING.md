# Contributing to GridReply

First, thank you for your interest in contributing to GridReply! 🎉 This document provides guidelines and instructions for contributing to this educational project.

---

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Types of Contributions](#types-of-contributions)
4. [Development Setup](#development-setup)
5. [Making Changes](#making-changes)
6. [Submitting Changes](#submitting-changes)
7. [Code Standards](#code-standards)
8. [Commit Message Guidelines](#commit-message-guidelines)
9. [Pull Request Process](#pull-request-process)
10. [Reporting Issues](#reporting-issues)

---

## Code of Conduct

Please read and follow our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive community for everyone.

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git** installed and configured
- **MongoDB** (for local development)
- Basic knowledge of TypeScript, React, and Node.js

### Setting Up Your Development Environment

1. **Fork the Repository**
   ```bash
   # Go to https://github.com/softenrj/GridReply
   # Click "Fork" in the top-right corner
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/GridReply.git
   cd GridReply
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/softenrj/GridReply.git
   ```

4. **Install Dependencies**
   ```bash
   # API
   cd api
   npm install
   
   # Client
   cd ../client
   npm install
   ```

5. **Create Environment Files**
   
   **api/.env.local:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gridreply
   JWT_SECRET=dev_secret_key
   NODE_ENV=development
   ```

   **client/.env.local:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

6. **Start Development Servers**
   ```bash
   # Terminal 1 - API
   cd api
   npm run dev
   
   # Terminal 2 - Client
   cd client
   npm run dev
   ```

---

## Types of Contributions

### 🐛 Bug Reports
- Found a bug? Report it!
- Create an issue with a clear description
- Include steps to reproduce
- Provide screenshots if applicable

### ✨ Feature Requests
- Have an idea? Share it!
- Describe the feature and its benefits
- Explain how it enhances the educational value
- Provide use cases or examples

### 📝 Documentation
- Improve README or code comments
- Add usage examples
- Fix typos and clarify instructions
- Add API documentation

### 🔧 Code Improvements
- Optimize performance
- Improve code quality
- Fix bugs
- Add tests
- Refactor for maintainability

### 🎨 UI/UX Enhancements
- Design improvements
- Better accessibility
- Responsive design fixes
- Component refinements

---

## Development Setup

### Project Structure

```
GridReply/
├── api/                    # Backend
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── controller/
│   │   ├── model/
│   │   ├── router/
│   │   ├── service/
│   │   └── sockets/
│   └── package.json
├── client/                 # Frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── service/
│   │   └── utils/
│   └── package.json
└── README.md
```

### Available Scripts

**API:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
```

**Client:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
```

---

## Making Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-live-notifications`
- `fix/poll-not-loading`
- `docs/improve-readme`
- `refactor/optimize-socket-connection`

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# API
cd api
npm run build
npm test  # If tests exist

# Client
cd client
npm run build
npm test  # If tests exist
```

### 4. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

---

## Code Standards

### TypeScript
- Use TypeScript for type safety
- Avoid `any` type; use proper typing
- Use interfaces for object shapes
- Keep types organized

### React Components
- Use functional components with hooks
- Use descriptive component names
- Keep components focused and reusable
- Add PropTypes or TypeScript interfaces

### Naming Conventions
```typescript
// Components (PascalCase)
export function PollingGrid() {}

// Variables and functions (camelCase)
const pollAnswers = [];
function handleSubmit() {}

// Constants (UPPER_SNAKE_CASE)
const MAX_GRID_SIZE = 50;

// Types/Interfaces (PascalCase)
interface PollResponse {}
type PollingMode = 'view' | 'edit';
```

### Code Quality
- Write self-documenting code
- Add comments for "why", not "what"
- Keep functions small and focused
- Avoid deeply nested conditions

---

## Commit Message Guidelines

Follow these guidelines for clear, meaningful commit messages:

### Format
```
<type>: <subject>

<body>

<footer>
```

### Type
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semicolons, etc.)
- `refactor:` Code refactoring without feature changes
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Subject Line
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- Don't end with a period
- Limit to 50 characters
- Example: `feat: add real-time answer notifications`

### Body (Optional)
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with a blank line
- Example:
```
Add real-time notifications when new answers are submitted.
This allows organizers to see responses as they come in,
improving the interactive experience.
```

### Examples

✅ Good:
```
feat: add reveal answers functionality

Implement API endpoint and frontend UI for revealing correct/wrong answers
with color coding (yellow/red). Updates grid in real-time via socket.io.
```

✅ Good:
```
fix: resolve grid persistence issue on page refresh

Fetch all saved answers from database on component mount to restore
answered cells after page refresh or navigation.
```

❌ Bad:
```
Fixed some bugs

Updated the thing. Made it better.
```

---

## Pull Request Process

### Before Creating a PR

1. **Rebase and Clean Up**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run Tests**
   ```bash
   npm run lint
   npm run build
   ```

3. **Update Documentation**
   - Update README if behavior changed
   - Add comments to complex code
   - Update API docs if endpoints changed

### Creating a PR

1. **Push Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to https://github.com/softenrj/GridReply
   - Click "New Pull Request"
   - Select your branch against `main`

3. **Fill in PR Description**

   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement
   
   ## Related Issues
   Closes #123
   
   ## Changes Made
   - Change 1
   - Change 2
   - Change 3
   
   ## Testing
   How to test these changes:
   1. Step 1
   2. Step 2
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Changes tested locally
   - [ ] Commits are well-formatted
   ```

### PR Review Process

1. **Author Reviews Changes**
   - Review your own code first
   - Check for any issues

2. **Automated Checks**
   - Tests must pass
   - Linter checks must pass
   - Code quality gates must pass

3. **Maintainer Review**
   - Will review code
   - May request changes
   - Provide constructive feedback

4. **Address Feedback**
   - Make requested changes
   - Push updates
   - Don't force push (rebasing is okay if no force)

5. **Merge**
   - PR will be merged when approved
   - Thank you for contributing! 🎉

---

## Reporting Issues

### Before Creating an Issue

- Search existing issues first
- Check the documentation
- Try the latest development version

### Creating a Good Issue

**Bug Report Template:**
```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happened

## Screenshots
If applicable, add screenshots

## Environment
- Browser/Platform: 
- Node version: 
- npm version: 
- GridReply version: 

## Additional Context
Any other relevant information
```

**Feature Request Template:**
```markdown
## Description
Clear description of the desired feature

## Motivation
Why this feature would be useful

## Proposed Solution
How you envision this working

## Alternative Approaches
Other ways to solve this problem

## Example Use Case
Real-world example of how this would be used
```

---

## Questions or Need Help?

- 📧 Email: rjsharmase@gmail.com
- 🐙 GitHub Issues: https://github.com/softenrj/GridReply/issues
- 💬 GitHub Discussions: https://github.com/softenrj/GridReply/discussions

---

## Important Notes

### License
By contributing to GridReply, you agree that:
- Your contributions will be licensed under the Educational License
- The author retains rights to commercial licensing
- You understand the license terms in [LICENSE](./LICENSE)

### Educational Purpose
- Remember this is an educational project
- Contributions should maintain educational value
- Focus on code quality and learning outcomes

### Credit
- Your contributions will be acknowledged
- Significant contributors may be listed as maintainers
- Proper attribution is important to us

---

## Recognition

We recognize and appreciate all contributors! Significant contributors may:
- Be listed in the README
- Receive maintainer status
- Be invited to guide the project direction
- Have their work highlighted in documentation

---

## Getting Your PR Merged

**Tips to increase the likelihood of merge:**

✅ Follow the contribution guidelines  
✅ Write clear commit messages  
✅ Make changes focused and atomic  
✅ Test thoroughly before submitting  
✅ Be responsive to feedback  
✅ Update documentation as needed  
✅ Be patient and professional  

---

## Thank You! 🙏

Your contributions help make GridReply better for students, educators, and developers everywhere. We truly appreciate your effort and dedication!

**Happy Contributing! 🚀**

---

*Last Updated: September 2026*
