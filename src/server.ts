import path             from 'path';
import bodyParser       from 'body-parser';
import os               from 'os';
import chalk            from 'chalk';
import express          from 'express';
import enterpriseRoutes from './routes/Enterprise.route'; // Rotas de funcionários
import libraryRoutes    from './routes/Library.route';    // Rotas de biblioteca
import hotelRoutes      from './routes/Hotel.route';      // Rotas de hotel

// Váriaveis para definições de rede
const port = 31063;
const host = '0.0.0.0';

// Criando o app do Express
const app = express();

// Função para obter IPs locais
const getLocalIPs = (): string[] => {
    const interfaces = os.networkInterfaces();
    const ips: string[] = [];
    for (const iface of Object.values(interfaces)) {
        if (!iface) continue;
        for (const config of iface) {
            if (config.family === 'IPv4' && !config.internal) {
                ips.push(config.address);
            }
        }
    }
    return ips;
};

// _________________________________________________________________________________________________________________________________________________________

// Configurando middleware
app.use(bodyParser.json());
app.use(express.json()); // Para requisições com `Content-Type: application/json`3
app.use(express.urlencoded({ extended: true })); // Para requisições com `Content-Type: application/x-www-form-urlencoded`
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta 'public'

// _________________________________________________________________________________________________________________________________________________________

// Rotas amigáveis para acesso as páginas
app.get('/library', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/library.html'));
});

app.get('/enterprise', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/enterprise.html'));
});

app.get('/hotel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/hotel.html'));
});

app.get('/tasks', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/tasks.html'));
});

// _________________________________________________________________________________________________________________________________________________________

// Rotas raizes
app.use('/api/library', libraryRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/hotel', hotelRoutes);

// _________________________________________________________________________________________________________________________________________________________

// Iniciando o servidor
app.listen(port, host, () => {
    console.log(chalk.greenBright('\n[SRV ✅] Servidor iniciado com sucesso!'));
    console.log(chalk.cyanBright('\nEndereços disponíveis:'));

    // Exibir URLs acessíveis
    console.log(chalk.yellowBright(`- Local:    http://127.0.0.1:${port}`));
    const localIPs = getLocalIPs();
    for (const ip of localIPs) {
        console.log(chalk.yellowBright(`- Rede:     http://${ip}:${port}`));
    }

    console.log(chalk.blueBright('\nPressione CTRL+C para parar o servidor.\n'));
});
