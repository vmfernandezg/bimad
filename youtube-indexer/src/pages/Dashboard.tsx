import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { fetchPlaylistVideos } from '../lib/youtube';
import { VideoCard } from '../components/VideoCard';
import { Search, LogOut, Plus, Loader2, PlaySquare } from 'lucide-react';

export default function Dashboard() {
  const { session } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Efecto de Debounce (500ms) propuesto por UX
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (session?.user.id) {
      loadVideos();
    }
  }, [session, debouncedSearchQuery, showFavoritesOnly]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('new-videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (showFavoritesOnly) {
        query = query.eq('is_favorite', true);
      }

      if (debouncedSearchQuery.trim()) {
        query = query.textSearch('fts', debouncedSearchQuery.trim(), { type: 'websearch', config: 'spanish' });
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setVideos(data || []);
    } catch (err) {
      console.error("Error cargando videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const extractPlaylistId = (url: string) => {
    const regExp = /[?&]list=([^#\&\?]+)/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : null;
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl) return;

    const pid = extractPlaylistId(playlistUrl);
    if (!pid) {
      alert("URL inválida de playlist de YouTube.");
      return;
    }

    setImporting(true);
    try {
      const items = await fetchPlaylistVideos(pid);
      if (items.length === 0) {
        alert("Lista vacía o privada");
        setImporting(false);
        return;
      }

      // Preparar payload asignando user_id
      const payload = items.map(v => ({
        ...v,
        user_id: session?.user.id
      }));

      const { error } = await supabase.from('new-videos').insert(payload);
      if (error) throw error;

      setPlaylistUrl('');
      loadVideos();
    } catch (err: any) {
      console.error(err);
      alert("Error importando: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    // Optimistic local update
    setVideos(prev => prev.map(v => v.id === id ? { ...v, is_favorite: !currentStatus } : v));
    
    // DB update
    const { error } = await supabase
      .from('new-videos')
      .update({ is_favorite: !currentStatus })
      .eq('id', id);
      
    if (error) {
      console.error(error);
      // Revert si falla
      setVideos(prev => prev.map(v => v.id === id ? { ...v, is_favorite: currentStatus } : v));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlaySquare className="w-8 h-8 text-red-500" />
            <h1 className="text-xl font-bold tracking-tight">YouTube Indexer</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" />
              <input
                type="text"
                placeholder="Buscar videos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-500"
              />
            </div>
            
            <button 
              onClick={() => supabase.auth.signOut()}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              Salir
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Import Section */}
        <section className="bg-slate-800/40 rounded-2xl p-6 mb-8 border border-slate-700/50 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-red-400" /> Importar nueva Playlist
          </h2>
          <form onSubmit={handleImport} className="flex gap-3">
            <input
              type="text"
              placeholder="Pega la URL de la playlist de YouTube aquí..."
              value={playlistUrl}
              onChange={e => setPlaylistUrl(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 focus:outline-none focus:border-red-500 transition-colors"
            />
            <button
              type="submit"
              disabled={importing || !playlistUrl}
              className="bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-medium px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.2)] disabled:shadow-none"
            >
              {importing && <Loader2 className="w-4 h-4 animate-spin" />}
              {importing ? 'Importando...' : 'Importar'}
            </button>
          </form>
        </section>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Tu Biblioteca</h2>
          <div className="flex items-center gap-2 bg-slate-800/80 rounded-full cursor-pointer p-1 border border-slate-700">
            <button 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!showFavoritesOnly ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setShowFavoritesOnly(false)}
            >
              Todos
            </button>
            <button 
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${showFavoritesOnly ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setShowFavoritesOnly(true)}
            >
              Favoritos
            </button>
          </div>
        </div>
        
        <div className="block sm:hidden mb-6">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar videos..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-sm rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-500"
              />
            </div>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-red-500" />
            <p>Cargando videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-slate-800/30 rounded-3xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
            {searchQuery || showFavoritesOnly ? (
              <p>No hay videos que coincidan con los filtros actuales.</p>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <PlaySquare className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Aún no tienes videos</h3>
                <p className="max-w-md mx-auto">Importa tu primera lista de reproducción usando el formulario de arriba para comenzar a crear tu índice personal.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map(v => (
              <VideoCard 
                key={v.id}
                id={v.id}
                youtubeId={v.youtube_video_id}
                title={v.title}
                channel={v.channel_title}
                thumbnail={v.thumbnail_url}
                isFavorite={v.is_favorite}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
