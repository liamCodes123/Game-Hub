document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CHAT TOGGLE LOGIC
    const chatBox = document.getElementById('chatBox');
    const chatToggle = document.getElementById('chatToggle');
    
    window.toggleChat = () => {
        chatBox.classList.toggle('hidden');
    };

    chatToggle.addEventListener('click', toggleChat);

    // 2. SEARCH & FILTER LOGIC
    const searchInput = document.getElementById('gameSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.game-card');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        gameCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            card.style.display = title.includes(query) ? 'block' : 'none';
        });
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.filter;
            gameCards.forEach(card => {
                if(category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. PEERJS GLOBAL CHAT LOGIC
    const chatMsgs = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChat');
    
    // Using a static lobby ID. First person in becomes host.
    const LOBBY_ID = 'NEON-ARCADE-LOBBY-XYZ'; 
    const peer = new Peer();
    let connections = [];

    peer.on('open', (myId) => {
        // Attempt to connect to the Global Lobby Host
        const conn = peer.connect(LOBBY_ID);
        setupConnection(conn);

        // If we can't connect, it likely means we need to be the Host
        peer.on('error', (err) => {
            if (err.type === 'peer-unavailable') {
                startHost();
            }
        });
    });

    function startHost() {
        const host = new Peer(LOBBY_ID);
        host.on('connection', (c) => {
            connections.push(c);
            c.on('data', (data) => {
                // Relay messages to all connected players
                broadcast(data);
                addMessage(data.user, data.msg);
            });
        });
    }

    function setupConnection(c) {
        c.on('open', () => {
            addMessage("System", "Joined the global lobby!");
            sendBtn.onclick = () => {
                const text = chatInput.value;
                if(!text) return;
                const data = { user: "Player-" + peer.id.substring(0,4), msg: text };
                c.send(data);
                addMessage("You", text);
                chatInput.value = "";
            };
        });

        c.on('data', (data) => {
            addMessage(data.user, data.msg);
        });
    }

    function broadcast(data) {
        connections.forEach(c => {
            if (c.open) c.send(data);
        });
    }

    function addMessage(user, msg) {
        const div = document.createElement('div');
        div.className = 'msg';
        div.innerHTML = `<strong>${user}:</strong> ${msg}`;
        chatMsgs.appendChild(div);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }
});
