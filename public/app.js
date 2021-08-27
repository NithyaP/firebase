document.addEventListener("DOMContentLoaded",event =>{
    let filterVar = ["toy","bat","electric","mid aged","balls","dolls","vehicles","baby","flying","toy set"];
    const app= firebase.app();
    const db = firebase.firestore();
    const myPost = db.collection('toys').where("category", "in", filterVar) ;
    myPost.get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc);
              const data = doc.data();
              console.log(data);
              render_card(data);
            });
          })

});

function render_card(data){

    
    
    let cardContainer = document.getElementById("card-container");

    let card = document.createElement('div');
    card.className = 'card';

    let imgcard = document.createElement('img');
    imgcard.className = 'card-img-top';
    imgcard.src = data.imgurl;

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';


    let title = document.createElement('h5');
    title.innerText = data.name;
    title.className = 'card-title';
    title.id ='title';

    let price = document.createElement('p');
    price.innerText = data.price;
    price.id = 'card-price';

   
    cardBody.appendChild(title);
    cardBody.appendChild(price);
    card.appendChild(imgcard);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
}


