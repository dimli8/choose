# 选课点评平台 (Course Review Platform)

A full-stack campus course review platform where students can browse courses, read and write reviews, like/comment on reviews, and report inappropriate content. Admins can moderate reviews.

## Project Structure

```
.
├── backend/
│   ├── config/
│   │   ├── constants.ts       # JWT, server config
│   │   └── passport.ts        # JWT + Local auth strategies
│   ├── db/
│   │   ├── index.ts           # Drizzle DB connection
│   │   ├── schema.ts          # All table definitions + Zod schemas
│   │   └── migrations/
│   │       ├── 0_init_add_user_model.sql
│   │       └── 1773494665485_add_course_review_tables.sql
│   ├── middleware/
│   │   ├── auth.ts            # authenticateJWT middleware
│   │   └── errorHandler.ts
│   ├── repositories/
│   │   ├── users.ts           # User CRUD
│   │   ├── courses.ts         # Course CRUD + stats update
│   │   └── reviews.ts         # Reviews, likes, comments, reports
│   ├── routes/
│   │   ├── auth.ts            # /api/auth/signup, login, me
│   │   ├── courses.ts         # /api/courses
│   │   └── reviews.ts         # /api/reviews
│   └── server.ts              # Express entry point
├── frontend/
│   └── src/
│       ├── App.tsx            # HashRouter + AuthProvider + routes
│       ├── pages/
│       │   └── Index.tsx      # Main app (all views inline)
│       ├── components/
│       │   ├── ui/            # shadcn/ui components
│       │   └── custom/
│       │       ├── Login.tsx
│       │       ├── Signup.tsx
│       │       └── OmniflowBadge.tsx
│       ├── contexts/
│       │   └── AuthContext.tsx # JWT auth state
│       ├── lib/
│       │   └── api.ts         # coursesApi + reviewsApi
│       ├── types/
│       │   └── index.ts       # All TypeScript types
│       └── index.css          # Campus Clarity theme (navy + amber)
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS V4, shadcn/ui, React Router (HashRouter)
- **Backend**: Express.js, TypeScript, Drizzle ORM, Passport.js (JWT + Local)
- **Database**: PostgreSQL
- **Auth**: JWT tokens stored in localStorage

## Key Features

1. **Course Browser** - Search/filter by college, type (通识课/专选课/体育课), sort by rating/grading/reviews
2. **Course Detail** - Stats (avg rating, grading, workload, recommend), teacher info, review list
3. **Review System** - Anonymous reviews with rating, grading, workload, recommend scores
4. **Social Features** - Like reviews, comment on reviews, report inappropriate content
5. **Admin Panel** - Moderate reviews (approve/reject/delete), accessible to admin role users
6. **Authentication** - JWT-based login/signup with role support (student/teacher/admin)

## Database Tables

- `Users` - id, name, email, password, role
- `Teachers` - id, name, college, title, avatarUrl
- `Courses` - id, name, code, college, type, teacherId, avgRating, avgGrading, avgWorkload, avgRecommend, reviewCount
- `Reviews` - id, courseId, userId, content, rating, grading, workload, recommend, status, likeCount, isAnonymous
- `ReviewLikes` - reviewId, userId (unique pair)
- `Comments` - reviewId, userId, content
- `Reports` - reviewId, userId, reason, status

## API Routes

- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login (returns JWT)
- `GET /api/auth/me` - Current user
- `GET /api/courses` - List courses (with filters: college, type, search, sortBy)
- `GET /api/courses/colleges` - Distinct colleges
- `GET /api/courses/:id` - Course detail
- `GET /api/reviews` - All approved reviews
- `GET /api/reviews/course/:courseId` - Reviews for a course
- `POST /api/reviews` - Create review (auth required)
- `PUT /api/reviews/:id/status` - Approve/reject (admin)
- `POST /api/reviews/:id/like` - Toggle like (auth)
- `GET /api/reviews/:id/comments` - Get comments
- `POST /api/reviews/:id/comments` - Add comment (auth)
- `POST /api/reviews/:id/report` - Report review (auth)

## Code Generation Guidelines

- All views are inline in `frontend/src/pages/Index.tsx` (no separate page files)
- API calls go through `frontend/src/lib/api.ts` (coursesApi, reviewsApi)
- Types defined in `frontend/src/types/index.ts`
- Backend follows: routes → repositories → Drizzle ORM
- Admin features require `user.role === 'admin'` check
- Reviews start as `status: 'pending'` and need admin approval to show publicly
- Course stats (avgRating etc.) are recalculated when a review is approved
