import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User.model';
import { Content } from '../models/Content.model';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect using env MONGO_URI
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to database.');

    // Clear existing
    await User.deleteMany({});
    await Content.deleteMany({});
    console.log('🧹 Cleared existing users and content.');

    // Create Admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin@123456',
      role: 'admin',
      isActive: true,
    });
    
    // The pre-save hook will hash the password
    await admin.save();
    console.log('👤 Admin user created successfully (admin@example.com / Admin@123456).');

    // Sample Content
    const sampleContents = [
      {
        title: 'Getting Started with Next.js CMS',
        category: 'Documentation',
        status: 'published' as const,
        summary: 'A comprehensive guide to understanding Next.js monorepo architecture and Headless CMS features.',
        body: `
# Welcome to the Next.js Headless CMS

This headless CMS allows developers to write content in **Markdown** and render it with clean typography, tables, and mathematical formulas.

## Core Features
1. **Redux Toolkit State Management**: Synchronised auth and content states.
2. **Tailwind CSS Styling**: Adaptive dark mode with glowing components.
3. **Rich Content Rendering**: Support for:
   - Nested lists (ordered and unordered)
   - Styled Markdown tables
   - LaTeX mathematical notations

## Nested List Demonstration
Here is an example of lists:
- First key item
  - Detail point A
    - Micro-detail A1
    - Micro-detail A2
  - Detail point B
- Second key item
  1. Action step one
  2. Action step two
     1. Sub-step 2a
     2. Sub-step 2b

## Table Structure
Below is a data table representing CMS performance:

| Page Type | Render Strategy | Load Time (ms) | SEO Friendly |
| :--- | :--- | :---: | :---: |
| Homepage | SSR / ISR | 45ms | Yes |
| Blog Article | ISR | 30ms | Yes |
| Admin Panel | CSR | 120ms | No (Indexed=False) |
| Documentation | Static | 15ms | Yes |

We use static rendering for public pages to ensure fast delivery.
`,
        author: admin._id,
      },
      {
        title: 'Introduction to Quantum Computing Equations',
        category: 'Blog',
        status: 'published' as const,
        summary: 'Explore the mathematical foundations of quantum computing, qubits, and wave functions using LaTeX representation.',
        body: `
# Mathematical Foundations of Quantum Mechanics

Quantum computing relies on linear algebra and state equations. Here we show how mathematical formulas are written and rendered in our CMS.

## Qubits and Wave Functions
The state of a single qubit is represented as a linear combination of two states:

$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$

where $\\alpha$ and $\\beta$ are complex numbers satisfying the probability normalization:

$$|\\alpha|^2 + |\\beta|^2 = 1$$

## Schrödinger's Equation
The time-dependent Schrödinger equation describes how the quantum state of a physical system changes over time:

$$i\\hbar \\frac{\\partial}{\\partial t} |\\psi(t)\\rangle = \\hat{H} |\\psi(t)\\rangle$$

Here, $\\hat{H}$ is the Hamiltonian operator representing the total energy of the system.

## Key Quantum Gates

| Operator | Representation | Matrix | Effect |
| :---: | :---: | :---: | :--- |
| **Pauli-X** | $X$ | $\\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$ | Bit-flip (Quantum NOT gate) |
| **Pauli-Z** | $Z$ | $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$ | Phase-flip |
| **Hadamard** | $H$ | $\\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$ | Creates superposition |

Quantum gates are linear transformations applied to quantum states.
`,
        author: admin._id,
      },
      {
        title: 'Draft - Content Customisation and Styling Rules',
        category: 'Page',
        status: 'draft' as const,
        summary: 'A draft article showcasing CSS rules, custom themes, and formatting options.',
        body: `
# Draft Page: CMS Themes

This is a draft page showing customization options. It is not visible on the public site, but admins can manage it via the dashboard.

## Einstein's Relativity Equation
One of the most famous physics equations:
$$E = mc^2$$

And the gravitational field equation:
$$G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}$$

These equations represent complex mathematical structures rendered dynamically.
`,
        author: admin._id,
      }
    ];

    for (const contentData of sampleContents) {
      const content = new Content(contentData);
      await content.save();
      console.log(`📝 Content created: "${content.title}" (slug: ${content.slug})`);
    }

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database.');
  }
}

seed();
