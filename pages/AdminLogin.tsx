import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, ArrowLeft, Info, KeyRound } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const { login, language } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1); // 1: Creds, 2: 2FA
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock validation
    if (username === 'admin' && password === 'secure') {
      setStep(2);
      setError('');
    } else {
      setError(language === 'ar' ? 'بيانات الاعتماد غير صالحة' : 'Invalid credentials. Access restricted.');
    }
  };

  const handle2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFaCode === '123456') { // Mock Code
      login();
      navigate('/admincyber'); // Updated redirect
    } else {
      setError(language === 'ar' ? 'رمز التحقق غير صحيح' : 'Invalid 2FA Code.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl border-t-4 border-maroon text-gray-900">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-maroon">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'دخول المسؤول' : 'Admin Access'}
          </h2>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* CREDENTIALS HINT - FOR USER CONVENIENCE */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex gap-3 text-blue-800">
             <KeyRound className="w-5 h-5 shrink-0 mt-0.5" />
             <div className="text-xs">
                 <p className="font-bold mb-1">{language === 'ar' ? 'بيانات الدخول التجريبية:' : 'Demo Credentials:'}</p>
                 <p>Username: <span className="font-mono bg-blue-100 px-1 rounded text-blue-900">admin</span></p>
                 <p>Password: <span className="font-mono bg-blue-100 px-1 rounded text-blue-900">secure</span></p>
                 <p className="mt-1">2FA Code: <span className="font-mono bg-blue-100 px-1 rounded text-blue-900">123456</span></p>
             </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white text-gray-900"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon bg-white text-gray-900"
              />
            </div>
            <button type="submit" className="w-full bg-maroon text-white py-3 rounded-lg font-bold hover:bg-[#7a0d2d] transition-colors">
              Verify Credentials
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FA} className="space-y-4">
            <p className="text-sm text-center text-gray-600 mb-4">
              Enter the 6-digit code sent to your authenticator app.
            </p>
            <div>
              <label className="block text-sm font-medium text-center text-gray-700 mb-1">2FA Code</label>
              <input
                type="text"
                value={twoFaCode}
                onChange={(e) => setTwoFaCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-maroon focus:border-maroon text-center text-2xl tracking-widest font-mono bg-white text-gray-900"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            </div>
            <button type="submit" className="w-full bg-maroon text-white py-3 rounded-lg font-bold hover:bg-[#7a0d2d] transition-colors">
              Authenticate
            </button>
          </form>
        )}

        <button 
          onClick={() => navigate('/')}
          className="w-full mt-6 text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Site
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;