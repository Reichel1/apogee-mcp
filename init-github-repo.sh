#!/bin/bash

# Apogee MCP - GitHub Repository Initialization Script
# Run this script to set up the repository as Reichel1/apogee-mcp

set -e

echo "🚀 Initializing Apogee MCP GitHub Repository..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the apogee root directory"
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
else
    echo "✅ Git repository already initialized"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Temporary folders
tmp/
temp/

# Vercel
.vercel

# Next.js
.next/
out/

# Prisma
prisma/generated/

# Database
*.db
*.sqlite

# Cache
.cache/
.parcel-cache/
EOF
fi

# Add all files to git
echo "📁 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Apogee MCP - Multi-agent AI development coordination

- Complete MCP server implementation with stdio and HTTP transports
- Next.js website with Apogee Studios branding
- Role-based coordination between Claude (planner) and Cursor (implementer)
- Write fence system for conflict-free collaboration
- Production-ready with Docker, Kubernetes, and Vercel configs
- Comprehensive documentation and examples

🚀 Ready for launch at mcp.apogeestudios.dev"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) not found. Please install it and run:"
    echo "   gh auth login"
    echo "   gh repo create Reichel1/apogee-mcp --public --source=. --remote=origin --push"
    echo ""
    echo "Or manually create the repository at: https://github.com/new"
    echo "Then run:"
    echo "   git remote add origin https://github.com/Reichel1/apogee-mcp.git"
    echo "   git push -u origin main"
    exit 0
fi

# Check if authenticated with GitHub
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub first:"
    echo "   gh auth login"
    exit 1
fi

# Create GitHub repository
echo "🌐 Creating GitHub repository Reichel1/apogee-mcp..."
gh repo create Reichel1/apogee-mcp --public --source=. --remote=origin --push --description="The first MCP server for multi-agent AI development coordination. Claude handles database design, Cursor implements features - without conflicts."

# Set up branch protection (optional)
echo "🛡️  Setting up branch protection..."
gh api repos/Reichel1/apogee-mcp/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null || echo "⚠️  Branch protection setup failed (you may need admin permissions)"

# Create labels for issues
echo "🏷️  Creating issue labels..."
gh label create "bug" --color "d73a4a" --description "Something isn't working" || true
gh label create "enhancement" --color "a2eeef" --description "New feature or request" || true
gh label create "documentation" --color "0075ca" --description "Improvements or additions to documentation" || true
gh label create "good first issue" --color "7057ff" --description "Good for newcomers" || true
gh label create "help wanted" --color "008672" --description "Extra attention is needed" || true

# Create issue templates directory
mkdir -p .github/ISSUE_TEMPLATE

# Bug report template
cat > .github/ISSUE_TEMPLATE/bug_report.yml << EOF
name: Bug Report
description: File a bug report
title: "[BUG] "
labels: ["bug"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
  - type: input
    id: contact
    attributes:
      label: Contact Details
      description: How can we get in touch with you if we need more info?
      placeholder: ex. email@example.com
    validations:
      required: false
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Also tell us, what did you expect to happen?
      placeholder: Tell us what you see!
    validations:
      required: true
  - type: dropdown
    id: platform
    attributes:
      label: Platform
      description: Which platform are you using?
      options:
        - Cursor (stdio)
        - Claude Code (remote MCP)
        - OpenAI Agents
        - Self-hosted
    validations:
      required: true
  - type: input
    id: version
    attributes:
      label: Version
      description: What version of Apogee MCP are you running?
      placeholder: ex. 1.0.0
    validations:
      required: true
EOF

# Feature request template
cat > .github/ISSUE_TEMPLATE/feature_request.yml << EOF
name: Feature Request
description: Suggest an idea for this project
title: "[FEATURE] "
labels: ["enhancement"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a new feature!
  - type: textarea
    id: problem
    attributes:
      label: Is your feature request related to a problem?
      description: A clear and concise description of what the problem is.
      placeholder: I'm always frustrated when...
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Describe the solution you'd like
      description: A clear and concise description of what you want to happen.
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Describe alternatives you've considered
      description: A clear and concise description of any alternative solutions or features you've considered.
    validations:
      required: false
EOF

echo ""
echo "🎉 SUCCESS! Repository Reichel1/apogee-mcp has been created!"
echo ""
echo "📋 Next steps:"
echo "   1. Visit: https://github.com/Reichel1/apogee-mcp"
echo "   2. Set up repository secrets for CI/CD"
echo "   3. Deploy to Vercel with: vercel --prod"
echo "   4. Submit to Cursor MCP directory"
echo ""
echo "🚀 Ready to launch the first commercial MCP server!"