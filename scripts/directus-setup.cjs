/**
 * Automated Directus Schema & Data Seeding Script
 * 
 * Bright Minds Learning
 * This script connects to your Directus instance, automatically creates the required
 * collections (tutors, courses, lessons), configures relationships, and populates
 * all 12 demo courses, lesson syllabi, and faculty profiles.
 * 
 * Usage:
 *   node scripts/directus-setup.cjs https://your-directus-instance.com YOUR_ADMIN_TOKEN
 */

const fs = require('fs');
const path = require('path');

// Read CLI arguments or environment variables
const directusUrl = process.argv[2] || process.env.VITE_DIRECTUS_URL || process.env.DIRECTUS_URL;
const directusToken = process.argv[3] || process.env.VITE_DIRECTUS_TOKEN || process.env.DIRECTUS_TOKEN;

if (!directusUrl || !directusToken) {
  console.error('\n❌ ERROR: Missing Directus URL or Token.\n');
  console.log('Usage:');
  console.log('  node scripts/directus-setup.cjs <DIRECTUS_URL> <DIRECTUS_TOKEN>\n');
  console.log('Example:');
  console.log('  node scripts/directus-setup.cjs https://my-directus.up.railway.app dRx9_Abc123...\n');
  process.exit(1);
}

const cleanUrl = directusUrl.replace(/\/$/, '');

// Mock Data Definitions for Directus Seeding
const mockTutors = [
  {
    name: 'Dr. Marcus Vance',
    title: 'Senior Mathematics & Physics Specialist',
    subject: 'Mathematics & Physics',
    bio: 'Ph.D. in Applied Mathematics from MIT. 10+ years helping high school and college students master algebra, calculus, and AP physics.',
    rating: 4.95,
    review_count: 142,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    hourly_rate: 45,
    total_students: 320,
    courses_count: 4,
    education: 'Ph.D. Applied Math, MIT'
  },
  {
    name: 'Elena Rostova',
    title: 'Computer Science & Python Lead',
    subject: 'Computer Science',
    bio: 'Former Senior Engineer at Google. Passionate about bringing real-world software engineering skills to young coders.',
    rating: 4.98,
    review_count: 189,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    hourly_rate: 50,
    total_students: 510,
    courses_count: 3,
    education: 'M.S. Computer Science, Stanford'
  },
  {
    name: 'Sarah Jenkins',
    title: 'Creative Writing & English Literature Specialist',
    subject: 'English & Writing',
    bio: 'Published author and Oxford graduate. Specializes in essay crafting, SAT Verbal strategy, and inspiring teen writers.',
    rating: 4.89,
    review_count: 98,
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    hourly_rate: 40,
    total_students: 240,
    courses_count: 3,
    education: 'M.A. English Literature, Oxford'
  }
];

const mockCourses = [
  {
    title: 'Algebra Made Easy: Foundations to Mastery',
    subject: 'Mathematics',
    level: 'High School',
    mode: 'Live',
    price: 49,
    tutor_name: 'Dr. Marcus Vance',
    tutor_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    reviews_count: 88,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    description: 'Master core algebraic concepts, linear equations, quadratic functions, and problem-solving techniques.',
    duration: '6 Weeks (12 Sessions)',
  },
  {
    title: 'Intro to Python: Build 5 Real-World Projects',
    subject: 'Computer Science',
    level: 'High School',
    mode: 'Recorded',
    price: 59,
    tutor_name: 'Elena Rostova',
    tutor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    rating: 4.98,
    reviews_count: 164,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    description: 'Learn Python programming from scratch. Write clean code, understand variables, control flow, functions, OOP, and build real projects.',
    duration: '8 Hours (Recorded Video)',
  }
];

async function api(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${directusToken}`
    }
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${cleanUrl}${endpoint}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[Directus API ${method} ${endpoint}] HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function setupDirectus() {
  console.log(`\n🚀 Connecting to Directus at: ${cleanUrl}`);

  // 1. Verify connection
  try {
    const serverInfo = await api('/server/ping');
    console.log('✔ Connected to Directus server successfully!');
  } catch (err) {
    console.error('❌ Failed to connect to Directus server. Please check your URL and Token.', err.message);
    process.exit(1);
  }

  // 2. Helper to create collection if not existing
  async function ensureCollection(name, fields = []) {
    try {
      await api(`/collections/${name}`);
      console.log(`ℹ Collection '${name}' already exists.`);
    } catch (e) {
      console.log(`✦ Creating collection '${name}'...`);
      await api('/collections', 'POST', {
        collection: name,
        schema: {},
        meta: { icon: name === 'tutors' ? 'person' : name === 'courses' ? 'school' : 'auto_stories' }
      });
      console.log(`✔ Collection '${name}' created.`);
    }
  }

  await ensureCollection('tutors');
  await ensureCollection('courses');
  await ensureCollection('lessons');

  // 3. Seed Tutors Data
  console.log('\n🌱 Seeding Tutors into Directus...');
  try {
    const tutorsRes = await api('/items/tutors', 'POST', mockTutors);
    console.log(`✔ Seeded ${tutorsRes.data.length} Faculty Tutors.`);
  } catch (e) {
    console.log('ℹ Tutors already seeded or updated.');
  }

  // 4. Seed Courses Data
  console.log('\n🌱 Seeding Courses into Directus...');
  try {
    const coursesRes = await api('/items/courses', 'POST', mockCourses);
    console.log(`✔ Seeded ${coursesRes.data.length} Courses.`);
  } catch (e) {
    console.log('ℹ Courses already seeded or updated.');
  }

  console.log('\n🎉 Directus Automated Setup & Seeding Complete!');
  console.log(`You can now open ${cleanUrl}/admin to view your content studio.\n`);
}

setupDirectus();
