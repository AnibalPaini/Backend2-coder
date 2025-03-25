const form = document.getElementById("loginForm");

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const dataForm= new FormData(form); //Trae toda la data que se haya cargado en el form


    const obj={};

    dataForm.forEach((value, key)=>{
        obj[key]=value;
    })

    //hacemos un fetch a las APIs
    fetch("/api/sessions/login", {
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(obj)
    }).then(result=>{
        if(result.status===200){
            
            result.json()
                .then(json=>{
                    //1° guardar jwt en localstorage
                    console.log(json);
                    /* localStorage.setItem('Authtoken',json.jwt) */ //Guardar token en localstorage

                    //2° guardar el jwt en cookie
                    console.log("Generar cookies");
                    console.log(document.cookie);//seteamos la cookie

                    
                    
                })
                
            window.location.replace("/users/") 
        }
    })


})