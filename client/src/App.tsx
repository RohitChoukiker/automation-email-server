
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import EmailPage from './components/2EmailPage';
// import { LandingPage } from './components/LandingPage';
// import { AuthProvider } from './context/AuthProvider';
// import { ThemeProvider } from './context/ThemeContext';
// import { ProtectedRoute } from './components/ProtectedRoute';
// import Dashboard from './components/Dashboard';
// import NotFound from './components/NotFound';
// import Privacy from './components/Privacy';
// import Terms from './components/Terms';
// import AuthCallback from './components/AuthCallback';



// function App() {
//   return (
//     <AuthProvider>
//       <ThemeProvider>
//         <Router>
//           <Routes>
//             <Route path="/" element={<LandingPage />} />
//             <Route path="/auth/callback" element={<AuthCallback />} />
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/privacy" element={<Privacy />} />
//             <Route path="/terms" element={<Terms />} />
//             <Route
//               path="/email/:id"
//               element={
//                 <ProtectedRoute>
//                   <EmailPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Router>
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import {EmailPage} from './components/EmailPage';
import { LandingPage } from './components/LandingPage';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import AuthCallback from './components/AuthCallback';

// 👇 ye do imports add karna zaroori hai
import { EmailList } from './components/EmailList';
import type { EmailCategory } from './types';
import { EmailDetail } from './components/EmailDetail';

const CATEGORIES: EmailCategory[] = [
  'ALL',
  'PRIMARY',
  'PROMOTIONS',
  'SOCIAL',
  'UPDATES',
];

// Optional: simple Emails layout with category tabs + list
const EmailsLayout = () => {
  const [activeCategory, setActiveCategory] = useState<EmailCategory>('ALL');

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex gap-2 mb-4 overflow-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm border ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <EmailList category={activeCategory} />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 👇 Protected email list page */}
            <Route
              path="/emails"
              element={
                <ProtectedRoute>
                  <EmailsLayout />
                </ProtectedRoute>
              }
            />

            {/* 👇 Protected email detail page (when user clicks on an email) */}
            <Route
              path="/email/:id"
              element={
                <ProtectedRoute>
                  <EmailDetail />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
