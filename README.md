# 💰 OpenSplitMoney

A **free, open-source** expense splitting app for friends and trips. Host it on your own GitHub Pages and share expenses with your friend circle!

![OpenSplitMoney](https://img.shields.io/badge/License-MIT-green.svg)
![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue)
![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)

## ✨ Features

- 🔐 **Google Sign-in** - Easy authentication with Google accounts
- ✈️ **Trip Management** - Create trips and invite friends with a simple code
- 💵 **Expense Tracking** - Add expenses with categories and custom splitting
- 📊 **Balance Calculation** - See who owes what and get settlement suggestions
- 🎨 **Beautiful UI** - Modern, responsive design that works on all devices
- 🆓 **100% Free** - Uses Firebase free tier, no costs involved

## 🚀 Quick Start

### Option 1: Fork and Deploy Your Own Instance

Perfect for your own friend circle!

1. **Fork this repository**

2. **Create a Firebase Project** (Free)
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" and follow the steps
   - Enable **Authentication** (Google Sign-in)
   - Enable **Firestore Database**

3. **Get Firebase Configuration**
   - In Firebase Console → Project Settings → Your Apps → Web App
   - Click "Add App" if you haven't already
   - Copy the configuration values

4. **Add GitHub Secrets**
   - Go to your forked repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

5. **Update Base URL**
   - Edit `vite.config.js` and change `base` to your repo name:
   ```js
   base: '/your-repo-name/',
   ```

6. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: "GitHub Actions"

7. **Deploy**
   - Push any change to trigger deployment
   - Or manually run the workflow from Actions tab

### Option 2: Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/opensplitmoney.git
cd opensplitmoney

# Install dependencies
npm install

# Create .env file with your Firebase config
cp .env.example .env
# Edit .env with your Firebase values

# Start development server
npm run dev
```

## 🔧 Firebase Setup Details

### 1. Enable Authentication

1. Firebase Console → Authentication → Sign-in method
2. Enable "Google" provider
3. Add your domain to "Authorized domains":
   - `yourusername.github.io` (for GitHub Pages)
   - `localhost` (for local development)

### 2. Enable Firestore

1. Firebase Console → Firestore Database → Create database
2. Start in **test mode** (we'll add rules later)
3. Choose a location close to your users

### 3. Firestore Security Rules

Go to Firestore → Rules and paste:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Trip rules
    match /trips/{tripId} {
      // Anyone authenticated can read trips they're a member of
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.memberIds;
      
      // Anyone authenticated can create a trip
      allow create: if request.auth != null;
      
      // Members can update trips
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.memberIds;
      
      // Only creator can delete
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.createdBy;
    }
    
    // Allow reading trips by invite code (for joining)
    match /trips/{tripId} {
      allow read: if request.auth != null;
    }
  }
}
```

## 📱 How to Use

### Creating a Trip

1. Sign in with Google
2. Click "Create Trip"
3. Enter trip name and description
4. Share the **6-character invite code** with friends

### Joining a Trip

1. Sign in with Google
2. Click "Join Trip"
3. Enter the invite code shared by your friend

### Adding Expenses

1. Open a trip
2. Click "Add Expense"
3. Fill in description, amount, and who paid
4. Select who to split the expense between
5. The app automatically calculates who owes what!

### Viewing Balances

- Go to the "Balances" tab to see:
  - Individual balances (positive = gets money back)
  - Suggested settlements (simplest way to settle up)

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Hosting**: GitHub Pages
- **Icons**: Lucide React

## 📝 Environment Variables

Create a `.env` file for local development:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own friend circle!

## 🙏 Credits

Built with ❤️ for splitting expenses fairly among friends.

---

**Note**: Firebase free tier is very generous and should be more than enough for personal use. It includes:
- 50K reads/day
- 20K writes/day
- 20K deletes/day
- 1 GB storage
