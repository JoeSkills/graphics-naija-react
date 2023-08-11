# Graphics Naija - Social Media Website for Graphic Designers

Graphics Naija is a social media website designed specifically for graphic designers to showcase their work, connect with other designers, and explore creative content. This README provides an overview of the project, setup instructions, and information about the technologies used.

## Table of Contents

- [Graphics Naija - Social Media Website for Graphic Designers](#graphics-naija---social-media-website-for-graphic-designers)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Introduction

Graphics Naija is a React-based social media website for graphic designers in Nigeria (Naija) to share their artwork, receive feedback, and engage with the creative community. The website aims to foster a supportive environment for designers to collaborate, learn, and grow their skills.

## Features

The social media website offers the following features:

1. User Authentication: Allow users to sign up, log in, and manage their profiles.
2. User Profiles: Each user has a profile page to display their portfolio and personal information.
3. Artwork Upload: Users can upload and share their graphic designs with the community.
4. Feed and Interaction: Users can browse a feed of artwork, like, comment, and follow other designers.
5. Search and Discover: Enable users to find specific artwork or designers through a search functionality.
6. Notifications: Notify users about new followers, likes, comments, and mentions.
7. Settings: Users can customize their account settings, privacy, and notification preferences.

## Technologies Used

The project leverages the following technologies:

- **React**: A popular JavaScript library for building user interfaces.
- **Firebase**: A cloud-based platform providing authentication, database, storage, and hosting services.
- **Vite**: A fast build tooling ecosystem for modern web projects.
- **Yarn**: A reliable package manager for managing project dependencies.
- **Material UI**: A React UI framework providing pre-designed components for a sleek and responsive design.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-username/graphics-naija-react.git
cd graphics-naija-react
```

2. Install the project dependencies:

```bash
yarn install
```

3. Set up Firebase:

   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication, Cloud Firestore, and Storage services.
   - Obtain your Firebase configuration (apiKey, authDomain, projectId, etc.).
   - Create a `.env` file in the root directory of the project and add your Firebase configuration:

     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

## Usage

To run the development server, use the following command:

```bash
yarn dev
```

The website will be available at `http://localhost:3000`.

## Contributing

We welcome contributions to make Graphics Naija even better! If you find any bugs or have ideas for new features, please submit an issue or pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Thank you for using Graphics Naija! We hope you enjoy connecting with the Nigerian graphic design community and showcasing your creativity. Happy designing! 🎨
