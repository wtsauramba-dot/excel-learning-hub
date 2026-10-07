/**
 * Headless CMS Adapter & Integration Layer
 * 
 * Excel Learning Hub Front-End Architecture
 * This module provides clean abstraction functions for fetching courses, tutors,
 * and user profiles from headless CMS platforms (Directus, Strapi v4/v5, Sanity.io).
 * 
 * Supported CMS Types: 'directus' | 'strapi' | 'sanity' | 'mock'
 */

import { Course, Tutor } from '../types';
import { mockCourses } from '../data/courses';
import { mockTutors } from '../data/tutors';

const CMS_TYPE = import.meta.env.VITE_CMS_TYPE || 'mock';
const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || 'http://localhost:1337/api';
const CMS_API_TOKEN = import.meta.env.VITE_CMS_API_TOKEN || '';
const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN || '';

/**
 * Fetch all published courses from CMS or Mock
 */
export async function fetchCoursesFromCMS(): Promise<Course[]> {
  if (CMS_TYPE === 'mock') {
    return Promise.resolve(mockCourses);
  }

  // --- Example 1: DIRECTUS CMS Integration ---
  if (CMS_TYPE === 'directus') {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (DIRECTUS_TOKEN) headers['Authorization'] = `Bearer ${DIRECTUS_TOKEN}`;

      const res = await fetch(`${DIRECTUS_URL}/items/courses?fields=*,lessons.*,tutor.*`, { headers });
      const json = await res.json();

      return json.data.map((item: any) => ({
        id: String(item.id),
        title: item.title,
        subject: item.subject,
        level: item.level,
        mode: item.mode,
        price: Number(item.price),
        tutorId: String(item.tutor?.id || item.tutor_id || ''),
        tutorName: item.tutor?.name || item.tutor_name || 'Excel Learning Hub Instructor',
        tutorAvatar: item.tutor?.photo ? `${DIRECTUS_URL}/assets/${item.tutor.photo}` : item.tutor_avatar,
        rating: Number(item.rating || 4.9),
        reviewsCount: Number(item.reviews_count || item.reviewsCount || 10),
        thumbnail: item.thumbnail ? (item.thumbnail.startsWith('http') ? item.thumbnail : `${DIRECTUS_URL}/assets/${item.thumbnail}`) : '/placeholder.jpg',
        description: item.description,
        duration: item.duration,
        lessonsCount: item.lessons ? item.lessons.length : 0,
        lessons: item.lessons ? item.lessons.map((l: any) => ({
          id: String(l.id),
          title: l.title,
          duration: l.duration,
          videoUrl: l.video_url || l.videoUrl,
          isPreview: Boolean(l.is_preview || l.isPreview),
          pdfUrl: l.pdf_url || l.pdfUrl,
          worksheetUrl: l.worksheet_url || l.worksheetUrl,
        })) : [],
      }));
    } catch (e) {
      console.error('Directus fetch failed, falling back to mock courses:', e);
      return mockCourses;
    }
  }

  // --- Example 2: STRAPI v4/v5 Integration ---
  if (CMS_TYPE === 'strapi') {
    const res = await fetch(`${CMS_API_URL}/courses?populate=*`, {
      headers: {
        'Authorization': `Bearer ${CMS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await res.json();
    return json.data.map((item: any) => ({
      id: String(item.id),
      title: item.attributes.title,
      subject: item.attributes.subject,
      level: item.attributes.level,
      mode: item.attributes.mode,
      price: item.attributes.price,
      tutorId: String(item.attributes.tutor?.data?.id || ''),
      tutorName: item.attributes.tutor?.data?.attributes?.name || 'Excel Learning Hub Instructor',
      tutorAvatar: item.attributes.tutor?.data?.attributes?.avatar?.data?.attributes?.url,
      rating: item.attributes.rating || 4.9,
      reviewsCount: item.attributes.reviewsCount || 10,
      thumbnail: item.attributes.thumbnail?.data?.attributes?.url || '/placeholder.jpg',
      description: item.attributes.description,
      duration: item.attributes.duration,
      lessonsCount: item.attributes.lessons?.data?.length || 0,
      lessons: item.attributes.lessons?.data?.map((l: any) => ({
        id: String(l.id),
        title: l.attributes.title,
        duration: l.attributes.duration,
        videoUrl: l.attributes.videoUrl,
        isPreview: l.attributes.isPreview,
        pdfUrl: l.attributes.pdfUrl,
        worksheetUrl: l.attributes.worksheetUrl,
      })) || [],
    }));
  }

  // --- Example 3: SANITY.IO GROQ Query ---
  if (CMS_TYPE === 'sanity') {
    const query = encodeURIComponent(`*[_type == "course"]{
      _id, title, subject, level, mode, price, rating, reviewsCount, description, duration,
      "thumbnail": thumbnail.asset->url,
      "tutorName": tutor->name,
      "tutorAvatar": tutor->photo.asset->url,
      "lessons": lessons[]->{_id, title, duration, videoUrl, isPreview, pdfUrl}
    }`);
    const res = await fetch(`https://${import.meta.env.VITE_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/production?query=${query}`);
    const json = await res.json();
    return json.result.map((item: any) => ({ ...item, id: item._id }));
  }

  return mockCourses;
}

/**
 * Fetch all verified tutors from Directus, Strapi, or Mock
 */
export async function fetchTutorsFromCMS(): Promise<Tutor[]> {
  if (CMS_TYPE === 'mock') {
    return Promise.resolve(mockTutors);
  }

  if (CMS_TYPE === 'directus') {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (DIRECTUS_TOKEN) headers['Authorization'] = `Bearer ${DIRECTUS_TOKEN}`;

      const res = await fetch(`${DIRECTUS_URL}/items/tutors?fields=*`, { headers });
      const json = await res.json();

      return json.data.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        title: item.title,
        subject: item.subject,
        bio: item.bio,
        rating: Number(item.rating || 4.9),
        reviewCount: Number(item.review_count || item.reviewCount || 10),
        photo: item.photo ? (item.photo.startsWith('http') ? item.photo : `${DIRECTUS_URL}/assets/${item.photo}`) : '',
        hourlyRate: Number(item.hourly_rate || item.hourlyRate),
        totalStudents: Number(item.total_students || item.totalStudents),
        coursesCount: Number(item.courses_count || item.coursesCount),
        education: item.education,
      }));
    } catch (e) {
      console.error('Directus tutor fetch failed:', e);
      return mockTutors;
    }
  }

  if (CMS_TYPE === 'strapi') {
    const res = await fetch(`${CMS_API_URL}/tutors?populate=*`, {
      headers: { 'Authorization': `Bearer ${CMS_API_TOKEN}` },
    });
    const json = await res.json();
    return json.data.map((item: any) => ({
      id: String(item.id),
      name: item.attributes.name,
      title: item.attributes.title,
      subject: item.attributes.subject,
      bio: item.attributes.bio,
      rating: item.attributes.rating,
      reviewCount: item.attributes.reviewCount,
      photo: item.attributes.photo?.data?.attributes?.url || '',
      hourlyRate: item.attributes.hourlyRate,
      totalStudents: item.attributes.totalStudents,
      coursesCount: item.attributes.coursesCount,
    }));
  }

  return mockTutors;
}
