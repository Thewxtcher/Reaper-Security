import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';

const EMOJI_CATEGORIES = {
  '😊 Smileys': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','☺️','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖'],
  '👋 People': ['👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦶','👂','🦻','👃','👀','👅','👄','💋','👶','👧','🧒','👦','👩','🧑','👨','👵','🧓','👴','👲','🧕','👮','💂','🕵️','👨‍⚕️','👩‍⚕️','👨‍🎓','👩‍🎓','👨‍🏫','👩‍🏫','👨‍⚖️','👩‍⚖️','👨‍🌾','👩‍🌾','👨‍🍳','👩‍🍳','👨‍🔧','👩‍🔧','👨‍💻','👩‍💻','👨‍🎤','👩‍🎤','👨‍🎨','👩‍🎨','👨‍✈️','👩‍✈️','🧙','🧝','🧛','🧟','🧞','🧜','🧚','👼','🤶','🎅'],
  '🐶 Animals': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🕷','🕸','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐈','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿','🦔','🌵','🌲','🌳','🌴','🌱','🌿','☘️','🍀','🍂','🍁','🍄','🌾','💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻'],
  '🍕 Food': ['🍏','🍎','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🥗','🥘','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥮','🍢','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🧃','🥤','🧋','🍵','☕','🫖','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾'],
  '⚽ Activities': ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🤿','🎿','🛷','🥌','🎯','🎮','🎲','🎰','🧩','♟️','🎭','🎨','🖼️','🎪','🏋️','🤸','⛹️','🤺','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚵','🚴','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎗️','🎫','🎟️','🎪','🤹','🎠','🎡','🎢'],
  '🌍 Travel': ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🛹','🛼','🚏','🛣️','🛤️','⛽','🚧','🚨','🚥','🚦','🛑','⚓','🛥️','🚢','✈️','🛩️','🛫','🛬','🛳️','🚀','🛸','🚁','🛺','🚟','🚠','🚡','🛰️','🏗️','🧳','🌁','🌃','🌄','🌅','🌆','🌇','🌉','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🛕','🕍','⛩️','🕋','⛲','⛺','🌐','🗺️','🧭','🏔️','⛰️','🌋','🗻','🏕️','🏖️','🏜️','🏝️','🏞️'],
  '💡 Objects': ['⌚','📱','💻','⌨️','🖥️','🖨️','🖱️','💾','💿','📀','📷','📸','📹','🎥','📞','☎️','📺','📻','🧭','⏰','🕰️','⌛','⏳','📡','🔋','🔌','💡','🔦','🕯️','🧯','💰','💳','✉️','📧','📦','📝','💼','📁','📂','📅','📆','📊','📋','📌','📍','📏','📐','✂️','🔒','🔓','🔑','🗝️','🔨','⚒️','🛠️','⚙️','🔧','🔩','🧲','🪝','🧰','🧲','🪜','🔗','🛒','🧴','🧹','🪣','🪤','🧷','🪡','🧵','🧶','🎁','🎀','🎊','🎉','🎈','🎏','🎐','🎑','🧧','🎎','🎍','🎋','🎃','🎄','🎆','🎇','🧨','✨','🎉'],
  '❤️ Symbols': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','☯️','☦️','🛐','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','💯','💢','♨️','⚠️','♻️','✅','❌','⭕','🛑','⛔','🚫','❇️','✳️','🌐','💠','Ⓜ️','🌀','💤','🆔','🆒','🆓','🆕','🆙','🆚','🆗','🔝','🔛','🔜','🔚','⏫','⏬','⏪','⏩','⏭️','⏮️','🔀','🔁','🔂','▶️','⏸️','⏹️','⏺️','🎦','🔅','🔆','📶','📳','📴','📵','📞','🔔','🔕','🎵','🎶','⁉️','❓','❔','❕','‼️','🔱','⚜️','🏳️','🏴','🚩'],
};

const GIPHY_KEY = 'dc6zaTOxFJmzC';

export default function MediaPicker({ onSelectEmoji, onSelectGif, onUpload, onClose }) {
  const [tab, setTab] = useState('emoji');
  const [emojiCat, setEmojiCat] = useState('😊 Smileys');
  const [gifSearch, setGifSearch] = useState('');
  const [gifs, setGifs] = useState([]);
  const [gifLoading, setGifLoading] = useState(false);
  const fileRef = useRef(null);
  const searchTimeout = useRef(null);

  const fetchGifs = async (q) => {
    setGifLoading(true);
    try {
      const endpoint = q
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=24&rating=g`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&limit=24&rating=g`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setGifs(data.data || []);
    } catch (e) { setGifs([]); }
    setGifLoading(false);
  };

  useEffect(() => {
    if (tab === 'gif') fetchGifs(gifSearch);
  }, [tab]);

  const handleGifSearchChange = (val) => {
    setGifSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchGifs(val), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-0 mb-2 w-80 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      {/* Tabs */}
      <div className="flex items-center border-b border-white/10">
        {[['emoji', '😊 Emoji'], ['gif', 'GIF'], ['upload', '📎 File']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 py-2 text-xs font-semibold transition-colors ${tab === id ? 'text-white border-b-2 border-red-500' : 'text-gray-500 hover:text-gray-300'}`}>
            {label}
          </button>
        ))}
        <button onClick={onClose} className="p-2 text-gray-600 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Emoji Tab */}
      {tab === 'emoji' && (
        <div>
          <div className="flex gap-1 p-1.5 border-b border-white/5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {Object.keys(EMOJI_CATEGORIES).map(cat => (
              <button key={cat} onClick={() => setEmojiCat(cat)}
                className={`px-2 py-1 rounded text-xs whitespace-nowrap flex-shrink-0 transition-colors ${emojiCat === cat ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                {cat.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="h-52 overflow-y-auto p-2">
            <div className="grid grid-cols-8 gap-0.5">
              {EMOJI_CATEGORIES[emojiCat].map((e, i) => (
                <button key={i} onClick={() => onSelectEmoji(e)}
                  className="text-xl hover:scale-125 hover:bg-white/10 rounded p-0.5 transition-transform text-center leading-7">
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GIF Tab */}
      {tab === 'gif' && (
        <div>
          <div className="p-2 border-b border-white/5 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <input
              value={gifSearch}
              onChange={e => handleGifSearchChange(e.target.value)}
              placeholder="Search GIFs..."
              className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none"
              autoFocus
            />
          </div>
          <div className="h-52 overflow-y-auto p-1.5">
            {gifLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full" />
              </div>
            ) : gifs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-600 text-sm">No GIFs found</div>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {gifs.map(gif => (
                  <button key={gif.id} onClick={() => { onSelectGif(gif.images.fixed_height.url, gif.title); onClose(); }}
                    className="rounded-lg overflow-hidden hover:opacity-80 hover:ring-2 hover:ring-red-500 transition-all">
                    <img src={gif.images.fixed_height_small.url} alt={gif.title}
                      className="w-full h-20 object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="px-2 pb-1 text-[10px] text-gray-700 text-right">Powered by GIPHY</div>
        </div>
      )}

      {/* Upload Tab */}
      {tab === 'upload' && (
        <div className="p-4 flex flex-col gap-3 h-52 justify-center">
          <input ref={fileRef} type="file"
            accept="image/*,video/*,.gif,.pdf,.zip,.txt,.js,.py,.sh,.md"
            className="hidden"
            onChange={e => { if (e.target.files?.[0]) { onUpload(e.target.files[0]); onClose(); } }}
          />
          <button onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-white/20 rounded-xl hover:border-red-500/60 hover:bg-red-500/5 transition-colors w-full">
            <span className="text-4xl">📁</span>
            <div>
              <div className="text-white font-medium text-sm text-center">Click to upload</div>
              <div className="text-gray-500 text-xs text-center mt-0.5">Images, GIFs, Videos, Docs</div>
            </div>
          </button>
        </div>
      )}
    </motion.div>
  );
}