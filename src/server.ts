import path from 'path';
import bodyParser from 'body-parser';
import os from 'os';
import chalk from 'chalk';
import express from 'express';
import enterpriseRoutes from './routes/Enterprise.route'; // Rotas de funcionários
import libraryRoutes from './routes/Library.route';    // Rotas de biblioteca

const port = 31063;
const host = '0.0.0.0';

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

// Criando o app do Express
const app = express();

// Configurando middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta 'public'

// Rotas amigáveis
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

// Adicionando rotas
app.use('/api/library', libraryRoutes);
app.use('/api/employees', enterpriseRoutes);

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
