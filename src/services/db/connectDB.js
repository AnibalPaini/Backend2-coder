import MongoSingleton from "../../config/mongodb.singleton.js"

export default async function initializeMongoService() {
    console.log("Iniciando servico para Mongo");
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        console.error("Error al iniciar MongoDB:", error);
        process.exit(1); // Salir con código de error
    }
}
