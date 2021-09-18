document.addEventListener("DOMContentLoaded",event =>{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('productId')
    
    console.log(productId);

    const app= firebase.app();
    let filterVar = ["electric","balls","dolls","vehicles","flying","toyset", "newborn", "costumes", "cosmetics", "others"];
    // let filterVar = getListData()
    
    if (productId) {
      getCardData(filterVar, productId)
    } else {
      render_dropdown(filterVar)
      getCardData(filterVar)
    }
    
});

function getListData(){

}

function getCardData(filterVar, productId = null){
  $('.navbar div').removeClass('show');
  const db = firebase.firestore();
  console.log(productId)
  if (productId) {
    param1 = "productId"
    condition = "=="
    param2 = productId
  } else {
    param1 = "category"
    condition = "in"
    param2 = filterVar
  }

  const getCards = db.collection('toys').where(param1, condition, param2) ;

  let cardContainer = document.getElementById("card-container");
  removeAllChildNodes(cardContainer)

  getCards.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log("no doc??")
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

    let details = document.createElement('p');
    details.innerText = data.details;
    details.className = 'card-text';
    details.id = 'card-details';

    let btnLgDiv = document.createElement('div');
    btnLgDiv.className = "btn-lg btn disable card-button-area"

    let btnText = document.createElement('p');
    btnText.className = "card-text btn-text"
    btnText.innerText = "Contact us for details"

    wBtn = render_whatsapp_btn(data.productId)
    pBtn = render_phone_btn()

    btnLgDiv.appendChild(btnText)
    btnLgDiv.appendChild(wBtn)
    btnLgDiv.appendChild(pBtn)

    cardBody.appendChild(title);
    cardBody.appendChild(details);
    card.appendChild(imgcard);
    card.appendChild(cardBody);
    card.appendChild(btnLgDiv);
    cardContainer.appendChild(card);
}

function render_phone_btn(){
  let btn = document.createElement('a');
  btn.className = "card-icons-cust"
  var base_url = window.location.origin;
  var productLink = base_url
  btn.href = "tel:916238905264"
  
  let img = document.createElement('img');
  img.src = "images/phone.png";

  btn.appendChild(img);
  return btn
}

function render_whatsapp_btn(productId){
  let btn = document.createElement('a');
  btn.className = "card-icons-cust"
  var base_url = window.location.origin;
  var productLink = base_url+"?productId="+productId
  btn.href = "https://wa.me/916238905264?text=I'm%20interested%20in%20this%20product%20"+productLink+"%20, Pls call me back"
  // btn.href = "https://wa.me/6596452181?text=I'm%20interested%20in%20this%20product%20"+productLink+"%20, Pls call me back"
  
  let img = document.createElement('img');
  img.src = "images/whatsapp.png";

  btn.appendChild(img);
  return btn
}

function render_dropdown(data){
  console.log(data)
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