document.addEventListener("DOMContentLoaded",event =>{
    const app= firebase.app();
    let filterVar = ["toy","bat","electric","mid aged","balls","dolls","vehicles","baby","flying","toy set"];
    // let filterVar = getListData()
    render_dropdown(filterVar)
    getCardData(filterVar)
});

function getListData(){

}

function getCardData(filterVar){
  const db = firebase.firestore();
  const getCards = db.collection('toys').where("category", "in", filterVar) ;
  
  let cardContainer = document.getElementById("card-container");
  removeAllChildNodes(cardContainer)

  getCards.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc);
            const data = doc.data();
            console.log(data);
            render_card(data);
          });
        })
}

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

    let btn = document.createElement('button');
    btn.innerText =" Add to cart";
    btn.className = "btn-lg";

    cardBody.appendChild(title);
    cardBody.appendChild(price);
    card.appendChild(imgcard);
    card.appendChild(cardBody);
    card.appendChild(btn);
    cardContainer.appendChild(card);
}

function render_dropdown(data){
  let dropdownElem = document.getElementById("dropdownElem");

  data.forEach(element => {
    let aElem = document.createElement('a');
    aElem.innerText = element;
    aElem.className = "dropdown-item";
    aElem.addEventListener('click', function(){
      getCardData([element]);
    });  
    dropdownElem.appendChild(aElem);
  });
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}