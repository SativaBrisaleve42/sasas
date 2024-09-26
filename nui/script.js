let player;
let isPlaying = false;
let currentStationIndex = 0;
let volumeLevel = 50; // Volume inicial
let isDragging = false;
let nuiContainer = document.getElementById('nui-container');

// Lista de rádios com nomes e IDs de vídeos do YouTube
const radioStations = [
    { name: "Purple Haze", videoId: "urikT3Act8w" },
    { name: "Tecno Radio", videoId: "eY6nlnBJa5g" },
    // Adicione mais rádios aqui
];

function loadStation(index) {
    currentStationIndex = index;
    document.getElementById('nui-display').innerText = radioStations[index].name;
    if (isPlaying) {
        player.loadVideoById(radioStations[index].videoId);
    }
}

// Função chamada pela API do YouTube quando ela está pronta
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: radioStations[currentStationIndex].videoId,
        events: {
            'onReady': onPlayerReady
        }
    });
}

// Quando o player estiver pronto, inicializa
function onPlayerReady(event) {
    event.target.setVolume(volumeLevel);
    loadStation(currentStationIndex);
}

// Controla o botão de play/pause
document.getElementById('play-button').addEventListener('click', function() {
    if (isPlaying) {
        player.stopVideo(); // Para o vídeo ao vivo
        document.getElementById('play-icon').innerText = 'play_arrow';
    } else {
        loadStation(currentStationIndex); // Recarrega o vídeo ao vivo
        player.playVideo();
        document.getElementById('play-icon').innerText = 'pause';
    }
    isPlaying = !isPlaying;
});

// Botão de fechar a NUI
document.getElementById('close-button').addEventListener('click', function() {
    fetch('https://RadioFM/close', {
        method: 'POST'
    }).then(() => {
        document.getElementById('nui-container').style.display = 'none';
        player.stopVideo(); // Para o vídeo ao fechar a NUI
        isPlaying = false;
        document.getElementById('play-icon').innerText = 'play_arrow';
    });
});

// Controle das estações de rádio
document.getElementById('prev-button').addEventListener('click', function() {
    currentStationIndex = (currentStationIndex > 0) ? currentStationIndex - 1 : radioStations.length - 1;
    loadStation(currentStationIndex);
});

document.getElementById('next-button').addEventListener('click', function() {
    currentStationIndex = (currentStationIndex < radioStations.length - 1) ? currentStationIndex + 1 : 0;
    loadStation(currentStationIndex);
});

// Controle do volume
document.querySelector('.volume-handle').addEventListener('mousedown', function(event) {
    isDragging = true;

    function moveVolume(event) {
        if (!isDragging) return;
        const rect = document.getElementById('volume-bar').getBoundingClientRect();
        const volumeHeight = Math.min(Math.max(0, rect.bottom - event.clientY), rect.height);
        volumeLevel = Math.round((volumeHeight / rect.height) * 100);

        // Atualiza a altura da barra de volume
        document.getElementById('volume-level').style.height = `${volumeLevel}%`;

        // Atualiza a posição do ícone de controle
        document.querySelector('.volume-handle').style.bottom = `calc(${volumeLevel}% - 5px)`;

        // Atualiza o volume do player
        player.setVolume(volumeLevel);
    }

    // Inicia o movimento do volume
    moveVolume(event);

    // Adiciona eventos de movimento e mouseup na janela
    window.addEventListener('mousemove', moveVolume);
    window.addEventListener('mouseup', function() {
        window.removeEventListener('mousemove', moveVolume);
        isDragging = false;
    }, { once: true });
});

// Movimento da NUI
let isDraggingNUI = false;
let startX, startY, initialLeft, initialTop;

nuiContainer.addEventListener('mousedown', function(event) {
    if (event.target.closest('button') || event.target.classList.contains('volume-handle')) {
        return; // Impede o arraste ao clicar nos botões
    }
    isDraggingNUI = true;
    startX = event.clientX;
    startY = event.clientY;
    initialLeft = nuiContainer.offsetLeft;
    initialTop = nuiContainer.offsetTop;
    nuiContainer.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', function(event) {
    if (!isDraggingNUI) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    nuiContainer.style.left = `${initialLeft + deltaX}px`;
    nuiContainer.style.top = `${initialTop + deltaY}px`;
});

window.addEventListener('mouseup', function() {
    isDraggingNUI = false;
    nuiContainer.style.cursor = 'move';
});

document.querySelector('.volume-handle').addEventListener('mouseup', function(event) {
    fetch('https://RadioFM/setVolume', {
        method: 'POST',
        body: JSON.stringify({ volume: volumeLevel / 100 })
    });
});

// Mostre nui quando desencadeado
window.addEventListener('message', function(event) {
    if (event.data.action === 'open') {
        document.body.style.display = 'block';  // Mostre nui quando desencadeado
    } else if (event.data.action === 'close') {
        document.body.style.display = 'none';   // Esconder nui quando fechado
    }
});
