import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, BarChart3, Calendar, FileText, Settings, Shield, TrendingUp,
  Eye, Trash2, Ban, CheckCircle2, RefreshCw, Search, ChevronDown,
  Activity, Globe, Zap, Database, Bell, LogOut, Home, X, AlertTriangle
} from 'lucide-react';
import { db, auth } from '../services/firebase';
import {
  collection, query, orderBy, onSnapshot, doc, deleteDoc,
  updateDoc, getDocs, getDoc, serverTimestamp, collectionGroup
} from 'firebase/firestore';

const ADMIN_EMAIL = 'sudheerimmidisetti@gmail.com';
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }) };

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, trend, color, index }) {
  return (
    <motion.div variants={fadeUp} custom={index} initial="hidden" animate="visible"
      className="glass-home-card rounded-2xl p-5 border border-white/5 hover:border-orange-500/20 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
        {trend && <span className="text-xs text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </motion.div>
  );
}

/* ── Tab Button ── */
function TabBtn({ active, icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      active ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <Icon size={16} />{label}
    </button>
  );
}

/* ── Users Tab ── */
function UsersTab({ users, onDelete }) {
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => (u.displayName || u.email || '').toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-orange-500/50 outline-none" />
        </div>
        <span className="text-sm text-gray-400">{filtered.length} users</span>
      </div>
      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        {filtered.map(u => (
          <div key={u.id} className="glass-home-card rounded-xl p-4 border border-white/5 flex items-center gap-4">
            {u.photoURL ? <img src={u.photoURL} className="w-10 h-10 rounded-full border border-white/10" alt="" />
              : <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-bold">{(u.displayName||u.email||'?')[0].toUpperCase()}</div>}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{u.displayName || 'No Name'}</p>
              <p className="text-xs text-gray-500 truncate">{u.email}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
              {u.role === 'admin' ? 'Admin' : 'User'}
            </span>
            <span className="text-[10px] text-gray-500">{u.createdAt?.toDate?.()?.toLocaleDateString?.() || 'N/A'}</span>
            {u.role !== 'admin' && (
              <button onClick={() => onDelete(u.id)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-500 py-8">No users found</p>}
      </div>
    </div>
  );
}

/* ── Meetings Tab ── */
function MeetingsTab({ meetings, onDelete, onUpdateStatus }) {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
      {meetings.map(m => (
        <div key={m.id} className="glass-home-card rounded-xl p-4 border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400"><Calendar size={16} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{m.startupName || 'Unnamed'} — {m.founderName || m.founderId?.slice(0,8)}</p>
            <p className="text-xs text-gray-500">{m.date} at {m.time} · {m.meetingType || 'online'}</p>
          </div>
          <select value={m.status} onChange={e => onUpdateStatus(m.id, e.target.value)}
            className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-gray-300 outline-none">
            <option value="confirmed">Confirmed</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option>
          </select>
          <button onClick={() => onDelete('meetings', m.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      ))}
      {meetings.length === 0 && <p className="text-center text-gray-500 py-8">No meetings found</p>}
    </div>
  );
}

/* ── Pitch Decks Tab ── */
function DecksTab({ decks, onDelete }) {
  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
      {decks.map(d => (
        <div key={d.id} className="glass-home-card rounded-xl p-4 border border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400"><FileText size={16} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{d.presentationTitle || d.startupName || 'Untitled Deck'}</p>
            <p className="text-xs text-gray-500">{d.slides?.length || 0} slides · {d.createdAt?.toDate?.()?.toLocaleDateString?.() || 'N/A'}</p>
          </div>
          <button onClick={() => onDelete('pitchDecks', d.id)} className="text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      ))}
      {decks.length === 0 && <p className="text-center text-gray-500 py-8">No pitch decks found</p>}
    </div>
  );
}

/* ── Settings Tab ── */
function SettingsTab() {
  const [features, setFeatures] = useState({ vcSim: true, investorMap: true, emailDraft: true, pptMaker: true, aiChat: true });
  const toggle = key => setFeatures(p => ({ ...p, [key]: !p[key] }));
  const items = [
    { key: 'vcSim', label: 'VC Simulator', desc: 'AI voice conversations with investors' },
    { key: 'investorMap', label: 'Investor Map', desc: 'Geographic investor discovery' },
    { key: 'emailDraft', label: 'Email Drafts', desc: 'AI-generated outreach emails' },
    { key: 'pptMaker', label: 'PPT Maker', desc: 'Pitch deck generation' },
    { key: 'aiChat', label: 'AI Chat Assistant', desc: 'Real-time AI support chat' },
  ];
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white mb-4">Feature Toggles</h3>
      {items.map(f => (
        <div key={f.key} className="glass-home-card rounded-xl p-4 border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">{f.label}</p>
            <p className="text-xs text-gray-500">{f.desc}</p>
          </div>
          <button onClick={() => toggle(f.key)} className={`w-12 h-6 rounded-full transition-all relative ${features[f.key] ? 'bg-orange-500' : 'bg-gray-700'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${features[f.key] ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
      ))}
      <div className="glass-home-card rounded-xl p-4 border border-white/5 mt-6">
        <h4 className="text-sm font-medium text-white mb-3">System Info</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[['Platform', 'Vite + React'], ['Auth', 'Firebase'], ['Database', 'Firestore'], ['AI Engine', 'Gemini'], ['Hosting', 'Railway'], ['Version', '2.0.0']].map(([k, v]) => (
            <div key={k} className="flex justify-between"><span className="text-gray-500">{k}</span><span className="text-gray-300">{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ ADMIN PANEL ═══════════════ */
const AdminPanel = ({ user }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [decks, setDecks] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    if (!user) { setIsAuthorized(false); setLoading(false); return; }
    setIsAuthorized(user.email === ADMIN_EMAIL);
    setLoading(false);
  }, [user]);

  // Fetch data
  useEffect(() => {
    if (!isAuthorized || !db) return;
    const unsubs = [];
    unsubs.push(onSnapshot(query(collection(db, 'users'), orderBy('createdAt', 'desc')), s => setUsers(s.docs.map(d => ({ id: d.id, ...d.data() })))));
    unsubs.push(onSnapshot(query(collection(db, 'meetings'), orderBy('createdAt', 'desc')), s => setMeetings(s.docs.map(d => ({ id: d.id, ...d.data() })))));
    unsubs.push(onSnapshot(query(collection(db, 'pitchDecks'), orderBy('createdAt', 'desc')), s => setDecks(s.docs.map(d => ({ id: d.id, ...d.data() })))));
    return () => unsubs.forEach(u => u());
  }, [isAuthorized]);

  const handleDeleteDoc = async (col, id) => { if (window.confirm('Delete this item?')) await deleteDoc(doc(db, col, id)); };
  const handleDeleteUser = async (id) => { if (window.confirm('Delete this user?')) await deleteDoc(doc(db, 'users', id)); };
  const handleUpdateMeetingStatus = async (id, status) => { await updateDoc(doc(db, 'meetings', id), { status }); };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><RefreshCw className="w-8 h-8 text-orange-500 animate-spin" /></div>;

  if (!user) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-full bg-orange-500/15 flex items-center justify-center"><Shield size={32} className="text-orange-400" /></div>
      <h2 className="text-2xl font-bold text-white">Admin Login Required</h2>
      <p className="text-gray-400 text-sm text-center max-w-sm">Please sign in with your admin account to access the control panel.</p>
      <button onClick={() => navigate('/login')} className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2">
        <LogOut size={16} /> Go to Login
      </button>
    </motion.div>
  );

  if (!isAuthorized) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center"><Shield size={32} className="text-red-400" /></div>
      <h2 className="text-2xl font-bold text-white">Access Denied</h2>
      <p className="text-gray-400 text-sm">You don't have permission to access the admin panel.</p>
      <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all text-sm font-medium">Go Home</button>
    </motion.div>
  );

  const confirmedMeetings = meetings.filter(m => m.status === 'confirmed').length;
  const recentUsers = users.filter(u => { const d = u.createdAt?.toDate?.(); return d && (Date.now() - d.getTime()) < 7 * 86400000; }).length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'decks', label: 'Pitch Decks', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-4 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"><Shield size={20} className="text-white" /></div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-gray-400">Manage your platform · {user?.email}</p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"><Home size={16} /> Back to App</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
        {tabs.map(t => <TabBtn key={t.id} active={tab === t.id} icon={t.icon} label={t.label} onClick={() => setTab(t.id)} />)}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={users.length} trend={`+${recentUsers} this week`} color="bg-blue-500/15 text-blue-400" index={0} />
            <StatCard icon={Calendar} label="Total Meetings" value={meetings.length} trend={`${confirmedMeetings} confirmed`} color="bg-green-500/15 text-green-400" index={1} />
            <StatCard icon={FileText} label="Pitch Decks" value={decks.length} color="bg-purple-500/15 text-purple-400" index={2} />
            <StatCard icon={Activity} label="Active Today" value={recentUsers || 1} color="bg-orange-500/15 text-orange-400" index={3} />
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-home-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Users size={18} className="text-orange-400" /> Recent Users</h3>
              <div className="space-y-3">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center gap-3">
                    {u.photoURL ? <img src={u.photoURL} className="w-8 h-8 rounded-full" alt="" /> : <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-xs text-orange-400 font-bold">{(u.displayName||'?')[0]}</div>}
                    <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{u.displayName || 'Anonymous'}</p><p className="text-[10px] text-gray-500">{u.email}</p></div>
                    <span className="text-[10px] text-gray-500">{u.createdAt?.toDate?.()?.toLocaleDateString?.() || ''}</span>
                  </div>
                ))}
                {users.length === 0 && <p className="text-sm text-gray-500">No users yet</p>}
              </div>
            </div>
            <div className="glass-home-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Calendar size={18} className="text-orange-400" /> Recent Meetings</h3>
              <div className="space-y-3">
                {meetings.slice(0, 5).map(m => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400"><Calendar size={14} /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm text-white truncate">{m.startupName || 'Meeting'}</p><p className="text-[10px] text-gray-500">{m.date} · {m.time}</p></div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${m.status === 'confirmed' ? 'bg-green-500/10 text-green-400' : m.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{m.status}</span>
                  </div>
                ))}
                {meetings.length === 0 && <p className="text-sm text-gray-500">No meetings yet</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'users' && <UsersTab users={users} onDelete={handleDeleteUser} />}
      {tab === 'meetings' && <MeetingsTab meetings={meetings} onDelete={handleDeleteDoc} onUpdateStatus={handleUpdateMeetingStatus} />}
      {tab === 'decks' && <DecksTab decks={decks} onDelete={handleDeleteDoc} />}
      {tab === 'settings' && <SettingsTab />}
    </motion.div>
  );
};

export default AdminPanel;
