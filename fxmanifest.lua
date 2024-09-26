fx_version 'cerulean'
game 'gta5'

author 'Sativa BrisaLeve "Purple Haze Scripts"'
description 'Script de RádioFM'
version '1.0.0'

shared_script 'config.lua'

-- Arquivos da NUI
ui_page 'nui/index.html'

files {
    'nui/index.html',
    'nui/style.css',
    'nui/script.js',
     'nui/scripts/SoundPlayer.js'
       -- Adicione qualquer outro arquivo de script ou mídia aqui
}

-- Scripts do servidor e cliente
client_scripts {
    '@vrp/lib/utils.lua',
    'client.lua'
    
}

server_scripts {
    '@vrp/lib/utils.lua',
    'server.lua'
}

dependencies {
    'xsound' -- Adicione aqui outros recursos de que o script dependa
}

