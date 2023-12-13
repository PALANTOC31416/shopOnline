let allProducts = "";
//Cuando se creen las cards y ek menu se activara este metodo, el cual se encarga
//de los eventos del menu
const activeEvents = () => {
    //Datos para agregar cards al carrito
    const containerCards = document.querySelector('.container-products');
    let cardsInCart = [];
    let myCart = document.querySelector('.my-products');
    //Contenedor del menu
    const contendsMenu = document.querySelector('.menup');
    let products = [];
    let categorySelected = "";

    contendsMenu.addEventListener('click', (e) => {
        //evitar el comportamiento predeterminado del evento
        e.preventDefault();
        products = [];

        //Creamos un objeto con claves, de las categorias
        //Para no usar multiples if, al comparar que categoria se selecciono
        categoryMap = {
            'electronics': 'electronics',
            'jewelery': 'jewelery',
            "men's clothing": "men's clothing",
            "women's clothing": "women's clothing"
        };

        //Preguntamos que item se selecciono
        //En el caso de que no se aya seleccionano ninguno, retornamos todos los productos
        categorySelected = categoryMap[e.target.id] || '';

        /* 
         *Filtramos la categoria correspondiente si es que se selecciono alguna
         *en el menu
         */
        if (categorySelected != "") {
            //Recorremos a los productos para filtrar los de categorySelected
            allProducts.forEach((product, index) => {
                if (product['category'] == categorySelected) {
                    products.push(product);
                }
            });
            //Invocamos al evento que crea los cards
            createCards(products);
        }
        /* 
         *elimina el card de el carrito si se preciona el boton de eliminar 
         */
        if (e.target.id == 'deleteCardSelected') {
            e.target.parentElement.remove();
        }
    });

    containerCards.addEventListener('click', (e) => {
        e.preventDefault();
        /* 
         *Si es que se selecciono algun producto para agregar al carrito 
         *Se lo agregamos
         */
        if (e.target.id == 'addCardToCart') {
            let cardSelected = e.target.parentElement.parentElement;
            myCart.innerHTML += `
                <div class="card-in-cart">
                    <img src="${cardSelected['childNodes'][1]['childNodes'][1]['src']}" alt="" class="">
                    <p>${cardSelected['childNodes'][1]['childNodes'][3]['innerHTML']}</p>
                    <p class="card-text">${cardSelected['childNodes'][1]['childNodes'][5]['innerHTML']}</p>
                    
                    <a src="#" class="btn btn-danger" id="deleteCardSelected" style="height:30px">X</a>
                </div>
            `;
        }
    });
}

//Menu que nos ayuda a crear el menu principal
//Resive una promesa, la cual contiene un arreglo con los respectivos datos
const createMenu = (categories) => {
    let dataCategories = "";
    /* 
     * Como categories es una promesa
     * la filtramos con then, para leer la respuesta 
     */
    categories.then(response => {
        let menu = document.querySelector('.menup');
        // iteramos el arreglo, mientras lo hacemos, vamos creando cata opcion del menu, pero la almacenamos en una variable
        response.forEach(category => {
            dataCategories += `
                <li class="nav-item"><a href="#" id="${category}" class="nav-link">${category}</a></li>
            `;
        });
        //Ya habiendo finalizado la iteracion insertamos la lista de opciones
        //En el contenedor menu
        menu.innerHTML = dataCategories;
        //Insertamos una opcion que mostrara el carrito de compras
        menu.innerHTML += `
            <li class="nav-item dropdown">
                <a class="dropdown-toggle btn btn-outline-success" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Cart</a>
                <ul class="dropdown-menu section-cart">
                    <li class="text-center"><p>My products</p></li>
                    <li><hr class="dropdown-divider"></li>
                    <li>
                        <div class="dropdown-item my-products w-350px"></div>
                    </li>
                </ul>
            </li>
   
        `;
        //Ya que existe el menu, activamos los eventos de las opciones
        //Ya que como es asincrona, si se activan antes generara un error de
        //no encontrar los respectivos elementos
        activeEvents();
    })
}

//Creamos las cards de los productos
//En la cual resivimos como parametro un arreglo con los productos
const createCards = (products) => {
    let containerCards = document.querySelector('.container-products');
    let dataProducts = "";
    //Recoremos el arreglo y bamos creando las cards, agregandolas a una variable
    products.forEach(product => {
        dataProducts += `
            <div class="col">
                <div class="card p-2">
                <img src="${product['image']}" alt="" class="card-img-top>
                    <div class="body text-center">
                        <h5 class="card-title text-primary text-center">${product['title']}</h5>
                        <p class="card-text price text-successç text-center">$${product['price']}</p>
                        <p class="card-text category">${product['category']}</p>
                        <p class="card-text description">${product['description']}</p>
                        <a href="#" class="btn btn-outline-primary" id="addCardToCart" data-id="${product['id']}">Comprar</a>
                    </div>
                </div>
            </div>
        `;
    });
    //Ya habiendo finalizado el recorrido de los productos, los insertamos
    //al contenedor containerCards
    containerCards.innerHTML = dataProducts;
}

//Funcion que ase la peticion a la API obteniendo todas las categorias
//La cual es asincrona, ya que si no lo es tarda un poco en cargar la pagina,
//ademas genera errores al crear los eventos de 'click', ya que como tarda
//en cargar, cuando carga el archivo, aun no carga el menu.
const getCategories = async() => {
    const response = await fetch('https://fakestoreapi.com/products/categories')
    try {
        //Llamamos al metodo que crea el menu, mandandole la respuesta de fetch
        createMenu(response.json());
    } catch (error) {
        return error;
    }
}

//Realizamos peticion a la API
//De igual manera es asincrona
const getProducts = async() => {
    const response = await fetch('https://fakestoreapi.com/products')
    try {
        //En este caso como vamos a usar la respuesta dos veces,
        //abrimos la promesa desde aqui, ya que si no lo hacemos
        //Genera un error de ejecucion de dos veces el metodo .json()
        response.json().then(res => {
            //le asignamos a allProductucs, la respuesta
            //Ya que como es una variable global la usaremos en otros metodos
            allProducts = res;
            //Creamos las cards
            createCards(res);
        });
    } catch (error) {
        return error;
    }
}

//Ejecutamos los metodos que traen la informacion de la API, y creamos el menu
//y los cards
getCategories();
getProducts();