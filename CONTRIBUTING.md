# 🤝 Contributing to Nano Computing ICT Employee Management System

Thank you for your interest in contributing to our enterprise-grade employee management solution! We welcome contributions from developers, designers, and domain experts who share our vision of revolutionizing workforce management.

## 📋 Table of Contents

- [🌟 Getting Started](#-getting-started)
- [🔧 Development Setup](#-development-setup)
- [📝 Contribution Guidelines](#-contribution-guidelines)
- [🎯 Types of Contributions](#-types-of-contributions)
- [🚀 Pull Request Process](#-pull-request-process)
- [📊 Code Standards](#-code-standards)
- [🧪 Testing Requirements](#-testing-requirements)
- [📖 Documentation](#-documentation)
- [🐛 Bug Reports](#-bug-reports)
- [💡 Feature Requests](#-feature-requests)
- [👥 Community Guidelines](#-community-guidelines)

---

## 🌟 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Git** for version control
- **Firebase CLI** for backend development
- **Code Editor** (VS Code recommended)

### First-Time Contributors

1. **Star the Repository** ⭐
2. **Fork the Repository** 🍴
3. **Join our Community** 💬
4. **Read the Documentation** 📚

---

## 🔧 Development Setup

### 1. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/nano-computing-ict-employee-management-system.git
cd nano-computing-ict-employee-management-system
```

### 2. Add Upstream Remote

```bash
git remote add upstream https://github.com/israelseleshi/nano-computing-ict-employee-management-system.git
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment

```bash
# Copy environment template
cp .env.example .env

# Configure Firebase (contact maintainers for test credentials)
```

### 5. Start Development Server

```bash
npm run dev
```

---

## 📝 Contribution Guidelines

### Branch Naming Convention

Use descriptive branch names with prefixes:

```bash
# Feature branches
feature/employee-profile-enhancement
feature/leave-management-calendar

# Bug fixes
fix/timesheet-calculation-error
fix/notification-display-issue

# Documentation
docs/api-documentation-update
docs/setup-guide-improvement

# Performance improvements
perf/dashboard-loading-optimization
perf/database-query-enhancement
```

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples:
```bash
feat(employee): add profile picture upload functionality

fix(timesheet): resolve calculation error for overtime hours

docs(readme): update installation instructions

perf(dashboard): optimize employee data loading
```

---

## 🎯 Types of Contributions

### 🔥 High Priority Areas

1. **Performance Optimization**
   - Database query optimization
   - Frontend bundle size reduction
   - Loading time improvements

2. **Security Enhancements**
   - Authentication improvements
   - Data encryption enhancements
   - Vulnerability assessments

3. **User Experience**
   - Mobile responsiveness
   - Accessibility improvements
   - UI/UX enhancements

4. **Feature Development**
   - Advanced reporting
   - Integration capabilities
   - Automation features

### 💡 Contribution Ideas

- **Bug Fixes** - Resolve existing issues
- **Feature Enhancements** - Improve existing functionality
- **New Features** - Add requested capabilities
- **Documentation** - Improve guides and API docs
- **Testing** - Increase test coverage
- **Translations** - Add internationalization support
- **Performance** - Optimize application performance
- **Security** - Enhance security measures

---

## 🚀 Pull Request Process

### 1. Prepare Your Changes

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code, test, document ...

# Commit your changes
git add .
git commit -m "feat: add your feature description"
```

### 2. Update Your Branch

```bash
# Fetch latest changes
git fetch upstream

# Rebase your branch
git rebase upstream/main
```

### 3. Run Quality Checks

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test

# Build verification
npm run build
```

### 4. Submit Pull Request

1. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use descriptive title and description
   - Link related issues
   - Add screenshots for UI changes
   - Include testing instructions

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Tests added/updated
   ```

### 5. Review Process

- **Automated Checks** - CI/CD pipeline must pass
- **Code Review** - Minimum 2 approvals required
- **Testing** - All tests must pass
- **Documentation** - Updates must be included
- **Security Review** - For sensitive changes

---

## 📊 Code Standards

### TypeScript Guidelines

```typescript
// ✅ Good - Explicit types
interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  hireDate: Date;
}

// ✅ Good - Proper error handling
const fetchEmployee = async (id: string): Promise<EmployeeProfile | null> => {
  try {
    const employee = await api.getEmployee(id);
    return employee;
  } catch (error) {
    console.error('Failed to fetch employee:', error);
    return null;
  }
};

// ❌ Bad - Any types
const updateEmployee = (data: any) => {
  // Implementation
};
```

### React Component Guidelines

```tsx
// ✅ Good - Functional component with proper typing
interface EmployeeCardProps {
  employee: EmployeeProfile;
  onEdit: (id: string) => void;
  className?: string;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  className = ''
}) => {
  const handleEdit = useCallback(() => {
    onEdit(employee.id);
  }, [employee.id, onEdit]);

  return (
    <div className={`employee-card ${className}`}>
      <h3>{employee.name}</h3>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

// ❌ Bad - Missing types and optimization
export const EmployeeCard = ({ employee, onEdit }) => {
  return (
    <div>
      <h3>{employee.name}</h3>
      <button onClick={() => onEdit(employee.id)}>Edit</button>
    </div>
  );
};
```

### CSS/Tailwind Guidelines

```tsx
// ✅ Good - Semantic class names with Tailwind
<div className="employee-profile-card bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <div className="profile-header flex items-center space-x-4 mb-4">
    <img 
      className="profile-avatar w-16 h-16 rounded-full object-cover" 
      src={employee.avatar} 
      alt={`${employee.name} avatar`}
    />
    <div className="profile-info">
      <h2 className="text-xl font-semibold text-gray-900">{employee.name}</h2>
      <p className="text-gray-600">{employee.position}</p>
    </div>
  </div>
</div>

// ❌ Bad - Inline styles and unclear structure
<div style={{backgroundColor: 'white', padding: '20px'}}>
  <div style={{display: 'flex'}}>
    <img src={employee.avatar} style={{width: '64px', height: '64px'}} />
    <div>
      <h2>{employee.name}</h2>
      <p>{employee.position}</p>
    </div>
  </div>
</div>
```

---

## 🧪 Testing Requirements

### Unit Tests

```typescript
// ✅ Good - Comprehensive unit test
describe('EmployeeService', () => {
  describe('calculateWorkingHours', () => {
    it('should calculate correct hours for full day', () => {
      const startTime = '09:00';
      const endTime = '17:00';
      const result = EmployeeService.calculateWorkingHours(startTime, endTime);
      expect(result).toBe(8);
    });

    it('should handle overnight shifts', () => {
      const startTime = '22:00';
      const endTime = '06:00';
      const result = EmployeeService.calculateWorkingHours(startTime, endTime);
      expect(result).toBe(8);
    });

    it('should throw error for invalid time format', () => {
      expect(() => {
        EmployeeService.calculateWorkingHours('invalid', '17:00');
      }).toThrow('Invalid time format');
    });
  });
});
```

### Integration Tests

```typescript
// ✅ Good - Integration test
describe('Employee Profile Integration', () => {
  it('should update employee profile successfully', async () => {
    const mockEmployee = createMockEmployee();
    const updates = { name: 'Updated Name' };

    render(<EmployeeProfile employee={mockEmployee} />);
    
    // User interactions
    fireEvent.click(screen.getByText('Edit Profile'));
    fireEvent.change(screen.getByLabelText('Name'), { 
      target: { value: updates.name } 
    });
    fireEvent.click(screen.getByText('Save'));

    // Assertions
    await waitFor(() => {
      expect(screen.getByText(updates.name)).toBeInTheDocument();
    });
  });
});
```

### Test Coverage Requirements

- **Minimum Coverage**: 80%
- **Critical Paths**: 95%
- **New Features**: 90%
- **Bug Fixes**: Must include regression tests

---

## 📖 Documentation

### Code Documentation

```typescript
/**
 * Calculates the total working hours between two time points
 * 
 * @param startTime - Start time in HH:MM format (24-hour)
 * @param endTime - End time in HH:MM format (24-hour)
 * @returns Total working hours as a decimal number
 * 
 * @example
 * ```typescript
 * const hours = calculateWorkingHours('09:00', '17:30');
 * console.log(hours); // 8.5
 * ```
 * 
 * @throws {Error} When time format is invalid
 */
export function calculateWorkingHours(startTime: string, endTime: string): number {
  // Implementation
}
```

### Component Documentation

```tsx
/**
 * EmployeeCard component displays employee information in a card format
 * 
 * @component
 * @example
 * ```tsx
 * <EmployeeCard 
 *   employee={employeeData}
 *   onEdit={handleEdit}
 *   showActions={true}
 * />
 * ```
 */
interface EmployeeCardProps {
  /** Employee data object */
  employee: EmployeeProfile;
  /** Callback function when edit button is clicked */
  onEdit: (employeeId: string) => void;
  /** Whether to show action buttons */
  showActions?: boolean;
  /** Additional CSS classes */
  className?: string;
}
```

---

## 🐛 Bug Reports

### Bug Report Template

```markdown
## Bug Description
A clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96, Firefox 95]
- Version: [e.g. 1.2.3]

## Additional Context
Any other context about the problem.
```

### Bug Severity Levels

- **Critical** 🔴 - System crashes, data loss, security vulnerabilities
- **High** 🟠 - Major functionality broken, significant user impact
- **Medium** 🟡 - Minor functionality issues, workarounds available
- **Low** 🟢 - Cosmetic issues, minor inconveniences

---

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Summary
Brief description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
Detailed description of the proposed solution.

## Alternative Solutions
Other approaches considered.

## User Stories
- As a [user type], I want [goal] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Considerations
Any technical constraints or requirements.

## Priority
- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low
```

---

## 👥 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General discussions and questions
- **Discord** - Real-time community chat
- **Email** - Direct contact with maintainers

### Recognition

We recognize and appreciate all contributions:

- **Contributors** - Listed in README and releases
- **Top Contributors** - Special recognition and badges
- **Maintainers** - Elevated privileges and responsibilities

### Getting Help

- **Documentation** - Check existing docs first
- **Search Issues** - Look for similar problems
- **Ask Questions** - Use GitHub Discussions
- **Join Community** - Connect with other contributors

---

## 🎉 Thank You!

Your contributions make this project better for everyone. Whether you're fixing bugs, adding features, improving documentation, or helping other contributors, every contribution is valuable and appreciated.

**Happy Contributing!** 🚀

---

<div align="center">

**Made with ❤️ by the Nano Computing ICT Community**

[![Contributors](https://img.shields.io/github/contributors/israelseleshi/nano-computing-ict-employee-management-system)](https://github.com/israelseleshi/nano-computing-ict-employee-management-system/graphs/contributors)
[![Issues](https://img.shields.io/github/issues/israelseleshi/nano-computing-ict-employee-management-system)](https://github.com/israelseleshi/nano-computing-ict-employee-management-system/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/israelseleshi/nano-computing-ict-employee-management-system)](https://github.com/israelseleshi/nano-computing-ict-employee-management-system/pulls)

</div>
