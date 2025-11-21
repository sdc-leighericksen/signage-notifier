// 🎉 CUSTOMIZE YOUR GIFS HERE 🎉
// Replace these URLs with your own GIFs from Giphy, Tenor, or any other source
// Each notification type ("good", "bad", "problem") will randomly select one GIF from its pool

export const GIF_POOLS = {
  good: [
    'https://media2.giphy.com/media/3ohze3kG5qO9DcTUbe/giphy.gif',
    'https://media2.giphy.com/media/vvbGMpbhZMcHSsD50w/giphy.gif',
    'https://media1.giphy.com/media/S9i8jJxTvAKVHVMvvW/giphy.gif',
  ],
  bad: [
    'https://media2.giphy.com/media/qryGWflHFCKv6/giphy.gif',
    'https://media0.giphy.com/media/KAQg0sejGV5F6/giphy.gif',
    'https://media4.giphy.com/media/vNNsw7IsdQfowDotga/giphy.gif',
  ],
  problem: [
    'https://media.giphy.com/media/xTiTnGeUsWOEwsGoG4/giphy.gif',
    'https://media4.giphy.com/media/yr7n0u3qzO9nG/giphy.gif',
    'https://media.giphy.com/media/dbtDDSvWErdf2/giphy.gif',
  ],
};

export const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const POLL_INTERVAL_MS = 5000;
