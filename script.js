document.addEventListener('DOMContentLoaded', () => {
    // --- FILTER LOGIC ---
    const search = document.getElementById('gameSearch');
    const cards = document.querySelectorAll('.game-card');
    const filters = document.querySelectorAll('.filter-btn');

    search.addEventListener('input', () => {
        const val = search.value.toLowerCase();
        cards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = title.includes(val) ? 'block' : 'none';
        });
    });

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            cards.forEach(c => c.style.display = (f === 'all' || c.dataset.category === f) ? 'block' : 'none');
        });
    });

    // --- GLOBAL CHAT LOGIC (PEERJS) ---
    const chatMsgs = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChat');
    
    // Using a fixed ID for the "Lobby Server"
    const LOBBY_ID = 'ARCADE-GLOBAL-LOBBY-2026'; 
    let peer = new Peer();
    let connections = [];

    // Try to become the host, or join the host
    peer.on('open', (myId) => {
        const conn = peer.connect(LOBBY_ID);
        setupChatConnection(conn);
        
        // If this fails, it means we might need to be the host
        peer.on('error', (err) => {
            if (err.type === 'unavailable-id') {
                // Someone is already the host, we are fine
            } else {
                // We become the host
                startHost();
            }
        });
    });

    function startHost() {
        const hostPeer = new Peer(LOBBY_ID);
        hostPeer.on('connection', (c) => {
            connections.push(c);
            c.on('data', (data) => {
                // Broadcast to everyone else
                addMessage(data.user, data.msg);
                connections.forEach(other => other.send(data));
            });
        });
    }

    function setupChatConnection(c) {
        c.on('open', () => {
            addMessage("System", "Connected to Global Chat!");
            sendBtn.onclick = () => {
                const msg = chatInput.value;
                if(!msg) return;
                const data = { user: "Player-" + peer.id.substring(0,4), msg: msg };
                c.send(data);
                addMessage("You", msg);
                chatInput.value = "";
            };
        });
        c.on('data', (data) => addMessage(data.user, data.msg));
    }

    function addMessage(user, msg) {
        const div = document.createElement('div');
        div.className = 'msg';
        div.innerHTML = `<b>${user}:</b> ${msg}`;
        chatMsgs.appendChild(div);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }
});
