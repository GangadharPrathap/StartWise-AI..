import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Shield, Camera, Upload, Trash2, Edit3, Save, X,
  ChevronRight, Lock, HelpCircle, Eye, EyeOff, CheckCircle2, AlertTriangle
} from 'lucide-react';

const PROFILE_KEY = 'startwise_profile';
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const LOCAL_USERS_KEY = 'startwise_users';

function getProfile(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    return all[userId] || null;
  } catch { return null; }
}

function saveProfile(userId, data) {
  const all = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  all[userId] = data;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(all));
}

/* ── Section Card ── */
function Section({ icon: Icon, title, children, index }) {
  return (
    <motion.div variants={fadeUp} custom={index} initial="hidden" animate="visible"
      className="glass-home-card rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400">
          <Icon size={16} />
        </div>
        <h3 className="text-white font-semibold text-sm">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

/* ── Editable Field with inline edit button ── */
function Field({ label, value, name, type = 'text', onChange, onSave, icon: Icon, placeholder, maskedEmpty }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => { setTempValue(value); }, [value]);

  const handleSave = () => {
    onChange({ target: { name, value: tempValue } });
    if (onSave) onSave();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-400 font-medium">{label}</label>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all">
            <Edit3 size={13} />
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <div className="relative">
            {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />}
            <input
              type={type} value={tempValue} onChange={e => setTempValue(e.target.value)}
              placeholder={maskedEmpty || placeholder || label} autoFocus
              className={`w-full bg-white/5 border border-orange-500/30 rounded-xl py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4 text-sm text-white placeholder:text-gray-600 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none transition-all`}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
              Cancel
            </button>
            <button onClick={handleSave}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 transition-all flex items-center gap-1">
              <Save size={11} /> Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5">
          {Icon && <Icon size={15} className="text-gray-500" />}
          <span className="text-sm text-gray-300">{value || <span className="text-gray-600 italic">Not set</span>}</span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ PROFILE PAGE ═══════════════ */
const Profile = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const defaults = {
    displayName: user?.displayName || '',
    username: '',
    email: user?.email || '',
    phone: '',
    photoURL: user?.photoURL || '',
  };

  // Password update state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleUpdatePassword = () => {
    setPwError('');
    setPwSuccess(false);
    if (!currentPw || !newPw || !confirmPw) { setPwError('Please fill in all fields'); return; }
    if (newPw.length < 6) { setPwError('New password must be at least 6 characters'); return; }
    if (newPw !== confirmPw) { setPwError('New passwords do not match'); return; }
    try {
      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
      const email = user.email;
      if (users[email] && users[email].password !== currentPw) { setPwError('Current password is incorrect'); return; }
      users[email] = { ...users[email], password: newPw };
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setPwSuccess(true);
      setTimeout(() => setPwSuccess(false), 3000);
    } catch { setPwError('Failed to update password'); }
  };

  const [profile, setProfile] = useState(defaults);

  // Load saved profile
  useEffect(() => {
    if (!user) return;
    const saved = getProfile(user.uid || user.email);
    if (saved) setProfile(p => ({ ...defaults, ...saved }));
  }, [user]);

  const handleChange = (e) => {
    setProfile(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    saveProfile(user.uid || user.email, profile);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    const saved = getProfile(user.uid || user.email);
    setProfile(saved ? { ...defaults, ...saved } : defaults);
    setEditing(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile(p => ({ ...p, photoURL: ev.target.result }));
      setShowPhotoMenu(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    setProfile(p => ({ ...p, photoURL: '' }));
    setShowPhotoMenu(false);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 pb-16">

      {/* Success toast */}
      <AnimatePresence>
        {saved && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-green-500/15 border border-green-500/20 text-green-400 text-sm font-medium shadow-2xl backdrop-blur-xl">
            <CheckCircle2 size={16} /> Profile saved successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your personal information and security</p>
        </div>
      </motion.div>

      {/* Profile Photo Section */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible"
        className="glass-home-card rounded-2xl border border-white/5 p-8 mb-6 flex flex-col sm:flex-row items-center gap-6 relative">
        <div className="relative group">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt="Profile"
              className="w-28 h-28 rounded-2xl object-cover border-2 border-white/10 shadow-xl" />
          ) : (
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-2 border-white/10">
              {(profile.displayName || profile.email || '?')[0].toUpperCase()}
            </div>
          )}
          <button onClick={() => setShowPhotoMenu(p => !p)}
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg hover:bg-orange-600 transition-all">
            <Camera size={16} />
          </button>

          {/* Photo Menu Dropdown */}
          <AnimatePresence>
            {showPhotoMenu && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-full mt-3 left-0 w-52 glass-home-card rounded-xl border border-white/10 shadow-2xl overflow-hidden z-20">
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                  <Upload size={15} className="text-orange-400" /> Upload from Gallery
                </button>
                <button onClick={() => cameraInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all border-t border-white/5">
                  <Camera size={15} className="text-blue-400" /> Take a Photo
                </button>
                {profile.photoURL && (
                  <button onClick={handleDeletePhoto}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all border-t border-white/5">
                    <Trash2 size={15} /> Remove Photo
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden file inputs */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
        </div>

        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-white">{profile.displayName || 'Your Name'}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{profile.email}</p>
          {profile.username && <p className="text-xs text-orange-400 mt-1">@{profile.username}</p>}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/15 font-medium">Active</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/15 font-medium">
              {user.email === 'sudheerimmidisetti@gmail.com' ? 'Admin' : 'Member'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Personal Information */}
        <Section icon={User} title="Personal Information" index={2}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" name="displayName" value={profile.displayName} onChange={handleChange} onSave={handleSave} icon={User} placeholder="John Doe" />
            <Field label="Username" name="username" value={profile.username} onChange={handleChange} onSave={handleSave} icon={User} placeholder="johndoe" />
          </div>
        </Section>

        {/* Contact Information */}
        <Section icon={Mail} title="Contact Information" index={3}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email Address" name="email" value={profile.email} type="email" onChange={handleChange} onSave={handleSave} icon={Mail} placeholder="you@email.com" />
            <Field label="Mobile Number" name="phone" value={profile.phone} type="tel" onChange={handleChange} onSave={handleSave} icon={Phone} placeholder="+91 98765 43210" maskedEmpty="xxxxxxxxxx" />
          </div>
        </Section>

        {/* Security & Privacy */}
        <Section icon={Shield} title="Security & Privacy" index={4}>
          <div className="space-y-4">
            <p className="text-xs text-gray-400">Update your password to keep your account secure.</p>

            {pwError && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                {pwError}
              </div>
            )}
            {pwSuccess && (
              <div className="px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 flex items-center gap-2">
                <CheckCircle2 size={15} /> Password updated successfully
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Current Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPassword.cur ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-gray-600 focus:border-orange-500/50 outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(p => ({ ...p, cur: !p.cur }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword.cur ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">New Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={showPassword.new ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-gray-600 focus:border-orange-500/50 outline-none transition-all" />
                  <button type="button" onClick={() => setShowPassword(p => ({ ...p, new: !p.new }))}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword.new ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">Confirm New Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type={showPassword.conf ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-gray-600 focus:border-orange-500/50 outline-none transition-all" />
                  <button type="button" onClick={() => setShowPassword(p => ({ ...p, conf: !p.conf }))}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPassword.conf ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {newPw && (
              <div className="flex items-center gap-3 text-xs">
                <span className={newPw.length >= 6 ? 'text-green-400' : 'text-gray-500'}>● Min 6 chars</span>
                <span className={newPw === confirmPw && confirmPw ? 'text-green-400' : 'text-gray-500'}>● Passwords match</span>
              </div>
            )}

            <button onClick={handleUpdatePassword}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 mt-2">
              <Lock size={14} /> Update Password
            </button>
          </div>
        </Section>

        {/* Danger Zone */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible"
          className="glass-home-card rounded-2xl border border-red-500/10 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/10">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center text-red-400">
              <AlertTriangle size={16} />
            </div>
            <h3 className="text-red-400 font-semibold text-sm">Danger Zone</h3>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Delete Account</p>
              <p className="text-xs text-gray-500 mt-0.5">Permanently delete your account and all data</p>
            </div>
            <button onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all">
              Delete Account
            </button>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative glass-home-card rounded-2xl border border-red-500/15 p-8 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mb-5">
                  <AlertTriangle size={28} className="text-red-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
                <p className="text-sm text-gray-400 mb-1">This will permanently delete your account and all associated data.</p>
                <p className="text-xs text-red-400/70 mb-6">This action cannot be undone.</p>

                <div className="flex gap-3 w-full">
                  <button onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    No, Keep Account
                  </button>
                  <button onClick={() => {
                    // Delete all user data
                    const email = user?.email;
                    try {
                      const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
                      delete users[email];
                      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
                    } catch {}
                    localStorage.removeItem('startwise_session');
                    const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
                    delete profiles[user?.uid || email];
                    localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
                    window.dispatchEvent(new Event('local-auth-change'));
                    window.location.href = '/login';
                  }}
                    className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
