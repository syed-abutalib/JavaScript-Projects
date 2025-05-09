# Blog Website with Laravel and React

This is a full-stack blog website built with Laravel (backend) and React (frontend).

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete blog posts
- Categorize posts
- Comment on posts
- Responsive design using Material UI

## Project Structure

The project is divided into two main parts:

1. **Backend (Laravel)**: Located in the `blog-backend` directory
2. **Frontend (React)**: Located in the `blog-frontend` directory

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js and npm
- MySQL or any other database supported by Laravel

## Installation and Setup

### Backend (Laravel)

1. Navigate to the backend directory:
   ```
   cd blog-backend
   ```

2. Install PHP dependencies:
   ```
   composer install
   ```

3. Create a copy of the `.env.example` file:
   ```
   cp .env.example .env
   ```

4. Generate an application key:
   ```
   php artisan key:generate
   ```

5. Configure your database in the `.env` file:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=blog
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. Run migrations:
   ```
   php artisan migrate
   ```

7. (Optional) Seed the database with sample data:
   ```
   php artisan db:seed
   ```

8. Start the Laravel development server:
   ```
   php artisan serve
   ```

   The API will be available at `http://localhost:8000`.

### Frontend (React)

1. Navigate to the frontend directory:
   ```
   cd blog-frontend
   ```

2. Install JavaScript dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login a user
- `POST /api/logout` - Logout a user
- `GET /api/user` - Get authenticated user

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get a specific category with its posts
- `POST /api/categories` - Create a new category (auth required)
- `PUT /api/categories/{id}` - Update a category (auth required)
- `DELETE /api/categories/{id}` - Delete a category (auth required)

### Posts
- `GET /api/posts` - Get all published posts (paginated)
- `GET /api/posts/{id}` - Get a specific post with its comments
- `POST /api/posts` - Create a new post (auth required)
- `PUT /api/posts/{id}` - Update a post (auth required)
- `DELETE /api/posts/{id}` - Delete a post (auth required)

### Comments
- `GET /api/posts/{postId}/comments` - Get all comments for a post
- `GET /api/posts/{postId}/comments/{id}` - Get a specific comment
- `POST /api/posts/{postId}/comments` - Create a new comment (auth required)
- `PUT /api/posts/{postId}/comments/{id}` - Update a comment (auth required)
- `DELETE /api/posts/{postId}/comments/{id}` - Delete a comment (auth required)

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

