# AGENTS.md
DONT Run npm run dev , ever again
## Project Overview

This is a **SolidJS** application with **Tailwind CSS** styling, using **TanStack Router** for routing and **TanStack Form** for form management. The project follows modern web development practices with TypeScript, component-based architecture, and utility-first CSS approach.

## Tech Stack

- **Framework**: SolidJS v1.9.9
- **Routing**: TanStack Router v1.133.20  
- **Forms**: TanStack Form v1.0.0
- **Styling**: Tailwind CSS v4.0.6
- **Build Tool**: Vite v7.2.4
- **TypeScript**: v5.7.2
- **Linting**: Biome v2.2.4
- **UI Components**: Kobalte Core v0.13.11
- **Validation**: Zod v4.1.13
- **Notifications**: Sonner v2.0.7

## Development Commands

### Build & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

### Code Quality
```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run check

# Run all checks (lint + format + type check)
npm run check
```

### Testing
```bash
# Run tests
npm run test

# Run single test file
npm run test -- path/to/test.test.ts
```

## Code Style Guidelines

### File Structure & Imports
- Use `.tsx` extension for all files containing JSX
- Import SolidJS components from `solid-js`, not React
- Use absolute imports with `@/` alias for internal modules
- Group related imports together (external libraries first, then internal)

```tsx
// ✅ Good
import { createForm } from "@tanstack/solid-form";
import { createFileRoute } from "@tanstack/solid-router";
import { toast } from "sonner";
import * as z from "zod";
import { TextField, TextFieldInput } from "@/components/ui/input";

// ❌ Bad
import React, { useState } from "react";
import { Form, Input } from "./components";
```

### Component Architecture
- Prefer functional components with hooks
- Use `createSignal()` for reactive state management
- Implement proper TypeScript typing for all props and state
- Use composition over inheritance
- Export components individually, not as default exports

```tsx
// ✅ Good - Functional component with proper typing
interface EmailFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export function EmailField(props: EmailFieldProps) {
  return (
    <div class="space-y-2">
      <label class="block text-sm font-medium">{props.label}</label>
      <input
        type="email"
        value={props.value}
        onInput={(e) => props.onValueChange(e.target.value)}
        class={props.error ? "border-red-500" : "border-gray-300"}
      />
      {props.error && <p class="text-red-500 text-sm">{props.error}</p>}
    </div>
  );
}
```

### Form Handling
- Use `createForm` from `@tanstack/solid-form` for form state
- Implement validation with Zod schemas
- Use `onBlur` or `onChange` validators appropriately
- Handle form submission with proper async/await patterns
- Show loading states during submission

```tsx
// ✅ Good - Form with proper validation
const form = createForm(() => ({
  defaultValues: { email: "" },
  validators: {
    onBlur: ({ value }) => {
      if (!value || value.trim().length === 0) {
        return "Email is required";
      }
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        return "Invalid email address";
      }
      return undefined;
    },
  },
  onSubmit: async ({ value }) => {
    await submitToWaitlist(value.email);
    toast.success("Successfully joined waitlist!");
  },
}));
```

### Styling with Tailwind CSS
- Use utility classes for styling, avoid inline styles
- Implement responsive design with Tailwind's responsive prefixes
- Use `@apply` directive in CSS files for reusable styles
- Leverage Tailwind's color system with CSS variables
- Use proper spacing, typography, and layout utilities

```tsx
// ✅ Good - Tailwind classes
<div class="max-w-md mx-auto p-6 space-y-4">
  <h2 class="text-2xl font-bold text-gray-900">Form Title</h2>
  <p class="text-gray-600 mb-4">Form description</p>
  <button class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
    Submit
  </button>
</div>

// ❌ Bad - Inline styles
<div style={{ maxWidth: '28rem', margin: '0 auto', padding: '1.5rem' }}>
  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>Form Title</h2>
</div>
```

### TypeScript Best Practices
- Enable strict mode and all type checking rules
- Use proper typing for form values and API responses
- Avoid `any` type - use specific types or type assertions
- Use interfaces for object shapes and component props
- Implement proper error handling with typed responses

```tsx
// ✅ Good - Proper typing
interface WaitlistFormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

const submitForm = async (data: WaitlistFormData): Promise<void> => {
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    throw error;
  }
};

// ❌ Bad - Using any
const submitForm = async (data: any): Promise<void> => {
  const response = await fetch('/api/waitlist', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  // No error handling, no typing
};
```

### Error Handling
- Implement proper try-catch blocks for async operations
- Use toast notifications for user feedback (Sonner)
- Validate user inputs before API calls
- Handle network errors gracefully
- Provide meaningful error messages

```tsx
// ✅ Good - Comprehensive error handling
const handleSubmit = async (formData: WaitlistFormData) => {
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || 'Submission failed');
      return;
    }

    toast.success('Successfully joined waitlist!');
  } catch (error) {
    console.error('Form submission error:', error);
    toast.error('An unexpected error occurred');
  }
};
```

### Routing with TanStack Router
- Use `createFileRoute` for file-based routing
- Implement proper navigation with `Link` components
- Use loaders for data fetching when appropriate
- Implement proper route protection and error boundaries

```tsx
// ✅ Good - Route with loader
export const Route = createFileRoute('/demo/waitlist-form')({
  component: WaitlistForm,
  loader: async () => {
    const response = await fetch('/api/waitlist-status');
    return response.json();
  },
});

// ✅ Good - Navigation
import { Link } from '@tanstack/solid-router';

<nav>
  <Link to="/" class="nav-link">Home</Link>
  <Link to="/demo/waitlist-form" class="nav-link active">Waitlist</Link>
</nav>
```

## Component Library Usage

### UI Components (Kobalte + Custom)
- Use Kobalte Core primitives for accessibility
- Wrap components in proper context providers
- Follow established patterns from `/src/components/ui`
- Use semantic HTML elements with proper ARIA attributes

```tsx
// ✅ Good - Using established UI components
import { TextField, TextFieldInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FormField(props: FieldProps) {
  return (
    <TextField>
      <TextFieldInput
        {...props}
        aria-invalid={!!props.error}
        class={props.error ? "border-destructive" : ""}
      />
    </TextField>
  );
}

// ❌ Bad - Bypassing established components
export function CustomInput(props: InputProps) {
  return <input {...props} />; // Missing context and styling
}
```

### Form Components (TanStack Form)
- Use `createForm` hook for form state management
- Implement proper validation strategies
- Use field components for consistent form structure
- Handle submission states and loading indicators

```tsx
// ✅ Good - TanStack Form integration
const form = createForm(() => ({
  defaultValues: { email: "" },
  validators: { /* validation logic */ },
  onSubmit: async ({ value }) => { /* submission logic */ },
}));

// Use form.Field for consistent field rendering
<form.Field name="email">
  {(field) => (
    <div class="space-y-2">
      <field.FieldLabel>Email</field.FieldLabel>
      <field.FieldInput />
      <field.FieldError />
    </div>
  )}
</form.Field>
```

## Performance Considerations

### SolidJS Optimizations
- Use `createMemo` for expensive computations
- Implement proper reactivity patterns to avoid unnecessary re-renders
- Use `For` component for lists instead of `map` when appropriate
- Lazy load components and routes when needed

```tsx
// ✅ Good - Memoized computation
const expensiveValue = createMemo(() => {
  return computeExpensiveValue(props.data);
});

// ✅ Good - Efficient list rendering
<For each={items()} fallback={<div>Loading...</div>}>
  {(item) => <ListItem item={item} />}
</For>
```

### CSS Performance
- Use Tailwind's JIT mode for production builds
- Implement proper CSS purging to remove unused styles
- Use CSS custom properties for theming
- Minimize layout shifts and use proper loading states

```css
/* ✅ Good - Efficient CSS with Tailwind */
@layer components {
  .form-field {
    @apply space-y-2;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-md;
    @apply hover:bg-blue-700 focus:ring-2 focus:ring-blue-500;
  }
}

/* ❌ Bad - Unused CSS */
.unused-class {
  @apply bg-red-500 text-white p-4; /* Never used in components */
}
```

## Testing Strategy

### Unit Testing
- Test components in isolation
- Test form validation logic
- Mock API responses for form submission tests
- Test error states and edge cases

```tsx
// ✅ Good - Component test
import { render, screen } from '@solidjs/testing-library';
import { EmailField } from './EmailField';

describe('EmailField', () => {
  it('should show error for invalid email', () => {
    render(() => <EmailField value="invalid-email" />);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });
  
  it('should call onValueChange when input changes', async () => {
    const handleChange = vi.fn();
    render(() => <EmailField value="" onValueChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await fireEvent.input(input, 'test@example.com');
    
    expect(handleChange).toHaveBeenCalledWith('test@example.com');
  });
});
```

### Integration Testing
- Test form submission end-to-end
- Test routing and navigation
- Test API integration
- Test user flows and error scenarios

```bash
# ✅ Good - Run specific test
npm run test -- EmailField.test.ts

# ✅ Good - Run tests with coverage
npm run test --coverage

# ✅ Good - Run tests in watch mode
npm run test --watch
```

## Accessibility Guidelines

### ARIA Attributes
- Use proper semantic HTML elements
- Implement proper ARIA labels and descriptions
- Ensure keyboard navigation support
- Use appropriate roles for interactive elements

```tsx
// ✅ Good - Accessible form
<form onSubmit={handleSubmit}>
  <fieldset>
    <legend>Contact Information</legend>
    <label for="email">Email Address</label>
    <input
      id="email"
      type="email"
      aria-required="true"
      aria-invalid={!!errors.email}
      aria-describedby={errors.email ? "email-error" : undefined}
    />
    {errors.email && (
      <div id="email-error" role="alert" class="text-red-500">
        {errors.email}
      </div>
    )}
  </fieldset>
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </button>
</form>
```

### Focus Management
- Implement proper focus trapping for modals
- Use `skip-link` CSS for non-essential links
- Ensure visible focus indicators
- Handle focus restoration after form operations

```tsx
// ✅ Good - Focus management
const handleFormSubmit = async () => {
  const firstInvalidField = document.querySelector('[aria-invalid="true"]');
  firstInvalidField?.focus();
  
  // Or use TanStack Form's built-in focus management
  form.handleSubmit();
};
```

## Security Best Practices

### Input Validation
- Validate all user inputs on both client and server
- Sanitize user inputs before processing
- Use proper email validation patterns
- Implement rate limiting for form submissions

```tsx
// ✅ Good - Secure validation
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return 'Invalid email address';
  }
  return null;
};

// ✅ Good - Sanitized submission
const submitForm = async (data: FormData) => {
  const sanitizedData = {
    email: data.email.trim().toLowerCase(),
  };
  
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken(),
    },
    body: JSON.stringify(sanitizedData),
  });
};
```

### API Security
- Use HTTPS for all API calls
- Implement proper authentication and authorization
- Validate and sanitize all inputs
- Use appropriate HTTP methods and status codes

```tsx
// ✅ Good - Secure API call
const apiRequest = async (endpoint: string, data: unknown) => {
  const response = await fetch(`https://api.example.com${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
};
```

## Development Workflow

### Git Workflow
- Use feature branches for new development
- Implement proper commit messages
- Use pull requests for code review
- Tag releases appropriately

```bash
# ✅ Good - Feature branch workflow
git checkout -b feature/waitlist-form
git add .
git commit -m "feat: add waitlist form with validation"

# ✅ Good - Commit message format
feat: add waitlist form with email validation
fix: resolve form submission error handling
docs: update API documentation
refactor: improve form validation performance
```

### Code Review Guidelines
- Review for accessibility compliance
- Check for security vulnerabilities
- Validate TypeScript types and error handling
- Ensure consistent styling and component patterns

## Environment Configuration

### Development
```bash
# .env.local (gitignored)
VITE_API_URL=http://localhost:3001
VITE_APP_TITLE="Solid Form App"
```

### Production
```bash
# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_TITLE="Production App"
```

## Common Patterns

### Form Patterns
```tsx
// ✅ Standard form structure
const StandardForm = () => {
  const form = createForm(() => ({
    defaultValues: getInitialValues(),
    validators: getValidationSchema(),
    onSubmit: handleSubmit,
  }));

  return (
    <form onSubmit={form.handleSubmit}>
      <form.Field name="field1">
        {(field) => <FormField field={field()} />}
      </form.Field>
      <form.Field name="field2">
        {(field) => <FormField field={field()} />}
      </form.Field>
      <SubmitButton />
    </form>
  );
};
```

### Async Data Patterns
```tsx
// ✅ Loader pattern for data fetching
export const Route = createFileRoute('/users')({
  loader: async () => {
    const users = await fetchUsers();
    return { users };
  },
  component: UserList,
});
```

### Error Boundary Pattern
```tsx
// ✅ Error handling with fallback
export const ErrorBoundary: Component<ErrorBoundaryProps> = (props) => {
  return (
    <Show when={props.error} fallback={<div>Something went wrong</div>}>
      <div class="error-message">
        <h2>Error</h2>
        <p>{props.error.message}</p>
      </div>
    </Show>
  );
};
```

## Debugging Tips

### SolidJS DevTools
- Install SolidJS DevTools for debugging
- Use `console.log` for state debugging
- Leverage browser dev tools for component inspection
- Use React DevTools compatible patterns

### Common Issues
- Form context errors: Ensure proper component hierarchy
- Validation not working: Check validator function signatures
- Styling not applying: Verify Tailwind CSS imports
- Routing issues: Check route file names and exports

## Notes for AI Agents

### When Working with Forms
- Always use `createForm` from `@tanstack/solid-form` instead of custom hooks
- Implement proper TypeScript typing for form data
- Use the established UI components from `/src/components/ui`
- Follow the existing patterns in `demo.form.tsx` for reference

### When Adding New Features
- Check existing route patterns in `/src/routes`
- Follow the file-based routing convention
- Update the route tree generation if needed
- Test both mobile and desktop responsiveness

### When Modifying Styles
- Use Tailwind CSS classes, avoid inline styles
- Follow the established color system in `/src/styles.css`
- Test in both light and dark modes
- Ensure responsive design works across breakpoints

### Performance Considerations
- SolidJS is highly optimized - avoid unnecessary re-renders
- Use `createMemo` for expensive computations
- Implement proper loading and error states
- Consider bundle size when adding new dependencies

This AGENTS.md file serves as the comprehensive guide for development in this SolidJS + TanStack + Tailwind CSS codebase. Follow these patterns and guidelines to maintain consistency, performance, and code quality across the project.