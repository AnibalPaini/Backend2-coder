const form = document.getElementById("registerForm");

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const dataForm= new FormData(form); //Trae toda la data que se haya cargado en el form


    const obj={};

    dataForm.forEach((value, key)=>{
        obj[key]=value;
    })

    //hacemos un fetch a las APIs
    fetch("/api/sessions/register", {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(obj)
    }).then(result=>{
        if(result.status===201){
            window.location.replace("/users/login")
        }
    })


})