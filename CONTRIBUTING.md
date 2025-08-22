# Contributing to Apogee AI Dev SDK

Thank you for your interest in contributing to Apogee! This document outlines how to contribute to our open source MCP server for multi-agent AI development.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Build** the project: `npm run build --workspaces`
5. **Test** your changes: `npm test`

## 🏗️ Development Setup

```bash
# Clone the repo
git clone https://github.com/apogee-studios/ai-dev-sdk.git
cd apogee

# Install dependencies
npm install

# Start development server (stdio mode)
npm run dev --workspace=apps/mcp-server -- --stdio

# Start HTTP server for testing
npm run dev --workspace=apps/mcp-server -- --port=3001

# Run tests
npm test

# Run linting
npm run lint
```

## 🎯 How to Contribute

### Reporting Bugs

**Before submitting a bug report:**
- Check existing [issues](https://github.com/apogee-studios/ai-dev-sdk/issues)
- Test with the latest version
- Include reproduction steps

**Bug Report Template:**
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Start Apogee MCP server
2. Connect from Cursor/Claude
3. Call `apogee.tool.name` with parameters
4. Observe error

## Expected Behavior
What should happen

## Actual Behavior  
What actually happens

## Environment
- OS: macOS/Linux/Windows
- Node.js version: 
- Apogee version:
- Client: Cursor/Claude Code/API
```

### Suggesting Features

**Feature Request Template:**
```markdown
## Feature Description
What feature would you like to see?

## Use Case
Why is this feature important? How would it be used?

## Proposed API
If applicable, suggest the tool/resource interface

## Implementation Ideas
Any thoughts on how this could be implemented?
```

### Code Contributions

#### Areas We Welcome Contributions

**🔧 Core Features:**
- New MCP tools for agent coordination
- Enhanced resource providers (CI status, code analysis)
- Performance optimizations
- Error handling improvements

**🔒 Security & Auth:**
- OAuth provider integrations
- Role-based access improvements
- Audit logging enhancements
- Security vulnerability fixes

**📊 Monitoring & Observability:**
- Metrics collection
- Health check improvements
- Debug tooling
- Performance profiling

**🌐 Integrations:**
- New database providers (beyond Supabase)
- CI/CD system integrations
- Additional MCP client support
- Webhook providers

**📚 Documentation:**
- Tutorial improvements
- API documentation
- Example projects
- Troubleshooting guides

#### Development Guidelines

**Code Style:**
- Follow existing TypeScript conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer explicit over implicit types

**Testing:**
- Write tests for new features
- Maintain existing test coverage
- Use descriptive test names
- Mock external dependencies

**Git Workflow:**
1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes with clear commit messages
3. Write/update tests as needed
4. Ensure all tests pass: `npm test`
5. Update documentation if needed
6. Submit pull request

**Commit Message Format:**
```
type(scope): description

feat(tools): add apogee.git.status tool for repo state
fix(auth): handle expired JWT tokens gracefully  
docs(api): update tool schemas with examples
test(patch): add tests for patch application edge cases
```

#### Pull Request Process

1. **Fork & Branch**: Create a feature branch from `main`
2. **Implement**: Make your changes following our guidelines
3. **Test**: Ensure all tests pass and add new ones if needed
4. **Document**: Update relevant documentation
5. **Submit**: Create a pull request with a clear description

**PR Template:**
```markdown
## Changes Made
- Brief description of what was changed
- Why this change was needed

## Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Documentation
- [ ] API documentation updated
- [ ] README updated if needed
- [ ] Examples updated if needed

## Breaking Changes
List any breaking changes and migration path
```

## 🏷️ Release Process

We follow [Semantic Versioning](https://semver.org/):
- **Patch** (1.0.1): Bug fixes, minor improvements
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

**Release Schedule:**
- Patch releases: As needed for critical fixes
- Minor releases: Monthly or when significant features are ready
- Major releases: When breaking changes are necessary

## 📋 Issue Labels

**Type:**
- `bug` - Something isn't working
- `feature` - New feature request
- `enhancement` - Improve existing feature
- `documentation` - Documentation improvements
- `security` - Security-related issues

**Priority:**
- `priority:high` - Needs immediate attention
- `priority:medium` - Important but not urgent
- `priority:low` - Nice to have

**Status:**
- `good first issue` - Great for newcomers
- `help wanted` - Community help needed
- `in progress` - Currently being worked on
- `blocked` - Cannot proceed for some reason

## 🤝 Community Guidelines

**Be Respectful:**
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Focus on constructive feedback
- Help create a positive community

**Be Collaborative:**
- Ask questions when unsure
- Offer help to other contributors
- Share knowledge and best practices
- Credit others for their contributions

## 💬 Getting Help

**Need Help?**
- Check our [documentation](https://docs.apogee.dev)
- Browse [existing issues](https://github.com/apogee-studios/ai-dev-sdk/issues)
- Join our [Discord community](https://discord.gg/apogee-ai-dev)
- Email: contributors@apogee.dev

**Maintainer Response Time:**
- Bug reports: Within 24-48 hours
- Feature requests: Within 1 week  
- Pull requests: Within 1 week
- Security issues: Within 24 hours

## 🏆 Recognition

We value all contributions! Contributors will be:
- Listed in our README
- Credited in release notes
- Invited to our contributor Discord channel
- Eligible for contributor swag (coming soon!)

**Top Contributors:**
- May be invited to join our contributor advisory board
- Get early access to new features
- Receive Apogee Cloud credits

---

**Thank you for helping make Apogee better!** 🚀

Every contribution, no matter how small, helps advance multi-agent AI development for the entire community.