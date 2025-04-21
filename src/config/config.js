import { Command } from "commander";
import dotenv from "dotenv"

const program = new Command()

program //Priemro el comando, segundo la descirpcion y tercero el valor default
    .option("-d", "Variable para debug", false)
    .option("-u, --username <username>", "Nombre del usuario", "no se a declarado ningun usuario")
    .option("-p <port>", "Puerto del servidor", 8080)
    .option("--mode <mode>", "Modo de trabajo", "development")
    .option('--persist <mode>', 'Modo de persistencia', "mongodb")
program.parse(); //Cierre, parsea los comandos y valida si son correctos

const enviroment =program.opts().mode;

dotenv.config({
    path: enviroment ==="production" ? './src/config/.env.production' : './src/config/.env.development'
})

export default{
    port: process.env.PORT,
    mongoUrl:process.env.MONGO_URL,
    adminName:process.env.ADMIN_NAME,
    persistence: program.opts().persist,
    adminPassword:process.env.ADMIN_PASSWORD
};