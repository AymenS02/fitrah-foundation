'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, LogOut, Check, X, Eye, EyeOff } from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({ current: '', newPass: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState({ email: false, password: false });

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // If using Next.js router, you'd need to import useRouter from 'next/navigation'
      // router.push('/login'); 
      window.location.href = '/login'; // Fallback redirect
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEmail(parsedUser.email);
    }
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleEmailUpdate = async () => {
    setLoading({ ...loading, email: true });
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/account/update-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify({ ...user, email }));
        setUser({ ...user, email });
        showMessage('Email updated successfully!', 'success');
      } else {
        showMessage(data.message || 'Failed to update email', 'error');
      }
    } catch (err) {
      showMessage('Network error occurred', 'error');
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwords.current || !passwords.newPass) {
      showMessage('Please fill in both password fields', 'error');
      return;
    }
    
    if (passwords.newPass.length < 6) {
      showMessage('New password must be at least 6 characters', 'error');
      return;
    }

    setLoading({ ...loading, password: true });
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/account/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      const data = await res.json();
      if (res.ok) {
        showMessage('Password updated successfully!', 'success');
        setPasswords({ current: '', newPass: '' });
      } else {
        showMessage(data.message || 'Failed to update password', 'error');
      }
    } catch (err) {
      showMessage('Network error occurred', 'error');
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // If using Next.js router, you'd need to import useRouter from 'next/navigation'
    // router.push('/login');
    window.location.href = '/login'; // Fallback redirect
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-secondary)] rounded-full mb-4">
            <User className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
            Account Settings
          </h1>
          <p className="text-[var(--color-muted-foreground)] mt-2">
            Manage your account information and preferences
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 flex items-center space-x-3 text-white ${
            messageType === 'success' 
              ? 'bg-[var(--color-success)] border-l-[var(--color-success)]'
              : messageType === 'error'
              ? 'bg-[var(--color-error)] border-l-[var(--color-error)]'
              : 'bg-[var(--color-info)] border-l-[var(--color-info)]'
          }`}>
            {messageType === 'success' ? (
              <Check className="w-5 h-5" />
            ) : messageType === 'error' ? (
              <X className="w-5 h-5" />
            ) : (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Information Card */}
          <div className="bg-[var(--color-card)] border-[var(--color-border)] rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-secondary px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1">
                    First Name
                  </label>
                  <p className="text-lg font-semibold text-[var(--color-foreground)]">
                    {user.firstName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1">
                    Last Name
                  </label>
                  <p className="text-lg font-semibold text-[var(--color-foreground)]">
                    {user.lastName}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-1">
                    Role
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-secondary)] text-[var(--color-foreground)]">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Update Card */}
          <div className="bg-[var(--color-card)] border-[var(--color-border)] rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-secondary px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Address
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 pl-10 border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg focus:ring-2 focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)] transition-colors"
                      placeholder="Enter your email address"
                    />
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-[var(--color-muted-foreground)]" />
                  </div>
                </div>
                <button
                  onClick={handleEmailUpdate}
                  disabled={loading.email || !email || email === user.email}
                  className="w-full bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--color-primary-hover)] focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {loading.email ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Update Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Password Update Card */}
          <div className="bg-[var(--color-card)] border-[var(--color-border)] rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-secondary px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Change Password
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full px-4 py-3 pl-10 pr-10 border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg focus:ring-2 focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)] transition-colors"
                      placeholder="Enter current password"
                    />
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[var(--color-muted-foreground)]" />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                      className="w-full px-4 py-3 pl-10 pr-10 border border-[var(--color-border)] bg-[var(--color-input)] text-[var(--color-foreground)] rounded-lg focus:ring-2 focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)] transition-colors"
                      placeholder="Enter new password"
                    />
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[var(--color-muted-foreground)]" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwords.newPass && passwords.newPass.length < 6 && (
                    <p className="text-sm text-[var(--color-error)] mt-1">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                <button
                  onClick={handlePasswordUpdate}
                  disabled={loading.password || !passwords.current || !passwords.newPass}
                  className="w-full bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--color-accent-hover)] focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {loading.password ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Logout Card */}
          <div className="bg-[var(--color-card)] border-[var(--color-border)] rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-foreground)]">
                    Sign Out
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Sign out of your account on this device
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 border border-[var(--color-error)]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}