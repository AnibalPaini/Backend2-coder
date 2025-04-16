import userModel from "../model/user.model.js";

export default class UserService{
    constructor(){}
    
    //Metodos que se pasan al controller
    obtenerUsuario= async()=>{
        let usuarios= await userModel.find();
        return usuarios.map(usuario=>usuario.toObject());
    };

    guardarUsuario= async(dato)=>{
        let userCreate= await userModel.create(dato);
        return userCreate;
    };

    eliminarUsuario= async(id)=>{
        let userdelete= await userModel.findByIdAndDelete(id);
        return userdelete;
    };

    actualizarUsuario=async(id, datos)=>{
        let userUpdate= await userModel.findByIdAndUpdate(id, datos, { new: true })
        return userUpdate
    }

    buscarUsuario= async(email)=>{
        return await userModel.findOne({email:email}) || null;
    }
}