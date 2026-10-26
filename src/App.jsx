import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Pin, 
  Tag, 
  
  CheckCircle2, 
  X, 
  LayoutGrid, 
  BookOpen,
  
  Check,
  StickyNote
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Notes', icon: '✦' },
  { id: 'Idea', label: 'Ideas', color: 'from-amber-400 to-orange-500' },
  { id: 'Work', label: 'Work', color: 'from-blue-400 to-indigo-500' },
  { id: 'Personal', label: 'Personal', color: 'from-emerald-400 to-teal-500' },
  { id: 'Todo', label: 'To-Do', color: 'from-rose-400 to-pink-500' }
];

const COLOR_ACCENTS = [
  { id: 'violet', border: 'border-violet-500/30', bg: 'bg-violet-500/10', glow: 'shadow-violet-500/10', dot: 'bg-violet-400' },
  { id: 'blue', border: 'border-blue-500/30', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/10', dot: 'bg-blue-400' },
  { id: 'emerald', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/10', dot: 'bg-emerald-400' },
  { id: 'rose', border: 'border-rose-500/30', bg: 'bg-rose-500/10', glow: 'shadow-rose-500/10', dot: 'bg-rose-400' },
  { id: 'amber', border: 'border-amber-500/30', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/10', dot: 'bg-amber-400' }
];

const INITIAL_NOTES = [
  {
    id: 1,
    title: '🚀 Launch NoteFlow v2.0',
    des: 'Upgrade interface with subtle glassmorphism, vibrant soft ambient glows, and rich tag filtering.',
    category: 'Work',
    color: 'violet',
    pinned: true,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  },
  {
    id: 2,
    title: '💡 Midnight Brainstorming',
    des: 'Explore WebAudio API for subtle UI sound feedback on note creation and deletion.',
    category: 'Idea',
    color: 'amber',
    pinned: false,
    createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
];

export default function App() {
  const [task, Settask] = useState(() => {
    const saved = localStorage.getItem('noteflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [title, Settitle] = useState('');
  const [des, Setdes] = useState('');
  const [category, setCategory] = useState('Idea');
  const [selectedColor, setSelectedColor] = useState('violet');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('noteflow_tasks', JSON.stringify(task));
  }, [task]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateOrUpdate = (e) => {
    e.preventDefault();
    if (!title.trim() || !des.trim()) {
      showToast('Please fill out title and content', 'error');
      return;
    }

    if (editingId !== null) {
      Settask(task.map(item => item.id === editingId ? {
        ...item,
        title: title.trim(),
        des: des.trim(),
        category,
        color: selectedColor
      } : item));
      setEditingId(null);
      showToast('Note updated successfully!');
    } else {
      const newTask = {
        id: Date.now(),
        title: title.trim(),
        des: des.trim(),
        category,
        color: selectedColor,
        pinned: false,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
      Settask([newTask, ...task]);
      showToast('New note added to your space!');
    }

    Settitle('');
    Setdes('');
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    Settitle(note.title);
    Setdes(note.des);
    setCategory(note.category || 'Idea');
    setSelectedColor(note.color || 'violet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    Settitle('');
    Setdes('');
  };

  const notedell = (id) => {
    Settask(task.filter(item => item.id !== id));
    showToast('Note moved to trash', 'info');
  };

  const togglePin = (id) => {
    Settask(task.map(item => item.id === id ? { ...item, pinned: !item.pinned } : item));
  };

  // Filtering & Sorting (Pinned first)
  const filteredNotes = task
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.des.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedFilter === 'all' || item.category === selectedFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="relative min-h-screen bg-[#0f111a] text-slate-100 font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Glow Ambient Backdrops */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-fuchsia-600/10 blur-[150px]" />
      <div className="pointer-events-none fixed -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-xl px-4 py-3 shadow-2xl transition-all duration-300 animate-bounce">
          <CheckCircle2 className={`h-5 w-5 ${toast.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`} />
          <span className="text-sm font-medium text-slate-200">{toast.message}</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0f111a]/75 backdrop-blur-2xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-500 shadow-lg shadow-violet-500/20">
              <StickyNote className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Note<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Flow</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span>Workspace Active</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="mx-auto max-w-7xl px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-violet-300 border border-violet-500/20 mb-3">
              <Sparkles className="h-3 w-3" /> Creative Hub
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Organize thoughts with{' '}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent">
                effortless elegance.
              </span>
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
              Capture inspiration, tag ideas, and stay structured in a beautifully balanced dark spatial canvas.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-slate-800/40 border border-white/10 rounded-2xl p-3 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-3 py-1">
              <BookOpen className="h-5 w-5 text-violet-400" />
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Notes</div>
                <div className="text-lg font-bold text-white">{task.length}</div>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3 px-3 py-1">
              <Pin className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400 font-medium">Pinned</div>
                <div className="text-lg font-bold text-white">{task.filter(t => t.pinned).length}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 pb-16 lg:grid-cols-[380px_1fr]">

        {/* Note Editor Form */}
        <section className="h-fit rounded-3xl border border-white/10 bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-6 shadow-2xl backdrop-blur-xl transition duration-300 hover:border-violet-500/30">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-inner">
                {editingId ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Note' : 'Create Note'}</h3>
                <p className="text-xs text-slate-400">{editingId ? 'Update your content' : 'Capture your thoughts'}</p>
              </div>
            </div>

            {editingId && (
              <button 
                onClick={cancelEdit}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-slate-300">Title</label>
              <input
                type="text"
                placeholder="What's on your mind?"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                value={title}
                onChange={(e) => Settitle(e.target.value)}
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-slate-300">Category Tag</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`rounded-lg py-1.5 px-2 text-xs font-medium border transition-all ${
                      category === cat.id 
                        ? 'border-violet-500/50 bg-violet-500/20 text-white shadow-sm' 
                        : 'border-white/5 bg-slate-950/30 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Accent Picker */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-slate-300">Accent Theme</label>
              <div className="flex items-center gap-2">
                {COLOR_ACCENTS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className={`h-7 w-7 rounded-full ${c.dot} flex items-center justify-center transition-transform ${
                      selectedColor === c.id ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {selectedColor === c.id && <Check className="h-3.5 w-3.5 text-slate-950 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-slate-300">Content</label>
              <textarea
                placeholder="Write down details, tasks or ideas..."
                className="h-36 w-full resize-none rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm leading-relaxed text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                value={des}
                onChange={(e) => Setdes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-900/30 transition-all duration-300 hover:brightness-110 active:scale-95"
            >
              {editingId ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />}
              <span>{editingId ? 'Save Note' : 'Add Note'}</span>
            </button>
          </form>
        </section>

        {/* Notes Container */}
        <section className="min-w-0 space-y-6">

          {/* Controls Bar: Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-800/30 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 pl-10 pr-4 py-2 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-violet-500/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedFilter === cat.id
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredNotes.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/20 px-6 text-center backdrop-blur-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-400 shadow-inner">
                <LayoutGrid className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No notes found</h3>
              <p className="mt-1 max-w-sm text-xs text-slate-400">
                {searchQuery || selectedFilter !== 'all'
                  ? 'Try adjusting your search query or tag filter.'
                  : 'Your space is empty. Create your first note on the left!'}
              </p>
            </div>
          ) : (
            /* Notes Grid */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
              {filteredNotes.map((note) => {
                const colorTheme = COLOR_ACCENTS.find(c => c.id === note.color) || COLOR_ACCENTS[0];

                return (
                  <article
                    key={note.id}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${colorTheme.border} bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${colorTheme.glow}`}
                  >
                    <div>
                      {/* Note Header Info */}
                      <div className="mb-3 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${colorTheme.bg} text-white border ${colorTheme.border}`}>
                          <Tag className="h-3 w-3" />
                          {note.category || 'General'}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Pin Toggle Button */}
                          <button
                            onClick={() => togglePin(note.id)}
                            title={note.pinned ? 'Unpin Note' : 'Pin Note'}
                            className={`rounded-lg p-1.5 transition ${
                              note.pinned ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <Pin className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Body */}
                      <h4 className=".break-words text-lg font-bold leading-snug text-white">
                        {note.title}
                      </h4>
                      <p className="mt-2.5 whitespace-pre-wrap .break-words text-xs leading-relaxed text-slate-300">
                        {note.des}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-[10px] font-medium text-slate-500">
                        {note.createdAt}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(note)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-violet-500/10 hover:text-violet-300 transition"
                          title="Edit Note"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => notedell(note.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition"
                          title="Delete Note"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center">
        <p className="text-xs text-slate-500">
          Crafted with <span className="text-violet-400">♥</span> using React & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}