import { supabase } from './supabase';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function invokeWithBackoff(playlistId: string, pageToken: string, maxRetries = 3) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const { data, error } = await supabase.functions.invoke('youtube-proxy', {
        body: { playlistId, pageToken }
      });
      
      if (error) throw new Error(error.message || "Error de red invocando youtube-proxy");
      if (data?.error) throw new Error(data.error || "Error al obtener playlist");
      
      return data;
    } catch (err: any) {
      attempt++;
      console.warn(`Intento ${attempt} fallido para youtube-proxy:`, err.message);
      if (attempt >= maxRetries) {
        throw err;
      }
      // Exponential backoff: 1000ms, 2000ms, 4000ms...
      const backoffTime = Math.pow(2, attempt - 1) * 1000;
      await sleep(backoffTime);
    }
  }
}

export async function fetchPlaylistVideos(playlistId: string) {
  let allVideos: any[] = [];
  let nextPageToken = '';
  
  do {
    const data = await invokeWithBackoff(playlistId, nextPageToken);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = data.items.map((item: any) => ({
      youtube_video_id: item.contentDetails?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description,
      channel_title: item.snippet?.videoOwnerChannelTitle || item.snippet?.channelTitle,
      thumbnail_url: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
    }));
    
    allVideos = [...allVideos, ...items];
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return allVideos;
}
