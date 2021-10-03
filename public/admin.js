var imgName, imgUrl;
var files = [];
let filterVar = ["electric","balls","dolls","vehicles","flying","toyset", "newborn", "costumes", "cosmetics", "others"];
var newSelect = document.getElementById("toyCategory");
filterVar.forEach((element, index) => {
  console.log(element)
  var opt = document.createElement("option");
  opt.value= element;
  opt.innerHTML = element; // whatever property it has

  // then append it to the select element
  newSelect.appendChild(opt);
})


document.addEventListener("DOMContentLoaded",event =>{

  const app= firebase.app();
  checkAuthState()

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const productId = urlParams.get('productId')
  
  console.log(productId);

  // const app= firebase.app();
  let filterVar = ["electric","balls","dolls","vehicles","flying","toyset", "newborn", "costumes", "cosmetics", "others"];
  // let filterVar = getListData()
  
  if (productId) {
    getCardData(filterVar, productId)
  } else {
    render_dropdown(filterVar)
    getCardData(filterVar)
  }
  
});

function checkAuthState(){
  firebase.auth().onAuthStateChanged(user=>{
    if(user){
      console.log("user logged in")
      renderNavBarMain();
    }else{
      renderNavBarLogin();
    }
  })
}



var reader = new FileReader();
// const db = firebase.firestore();

// Login click
document.getElementById("gLogin").onclick = function(e){
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      renderNavBarMain()
      // ...
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    })
}


// NAV panel click toggles
document.getElementById("login").onclick = function(e){
  $("#HomePanel").hide();
  $("#AddToyPanel").hide();
  $("#LoginPanel").show();
}
document.getElementById("home").onclick = function(e){
  $("#HomePanel").show();
  $("#AddToyPanel").hide();
  $("#LoginPanel").hide();
}
document.getElementById("addToy").onclick = function(e){
  $("#HomePanel").hide();
  $("#AddToyPanel").show();
  $("#LoginPanel").hide();
}

document.getElementById("logout").onclick = function(e){
  firebase.auth().signOut().then(() => {
      renderNavBarLogin()
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
}

// Select Image
document.getElementById("myimg").onclick = function(e){
    var input = document.createElement("input");
    input.type = 'file';
    
    input.onchange = e => {
      files = e.target.files;
      reader = new FileReader();
      reader.onload = function(){
        document.getElementById("myimg").src = reader.result;
      }
      reader.readAsDataURL(files[0]);
    }
    input.click();
}

// Upload image
document.getElementById("upload").onclick = function(){

  toyName = document.getElementById('toyName').value;
  imgName = toyName.replace(/\s/g, '')
  filePath = 'thumbnail/test/'+imgName+".png"
  console.log(filePath)
  var uploadTask = firebase.storage().ref(filePath).put(files[0]);
  
  uploadTask.on('state_changed', function(snapshot){
    
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    document.getElementById('upProgress').innerHTML = 'Upload'+progress+'%';
    },

    function(error){
      popupAlert('Error in upoading the image', 'error')
      },

    function(){
      uploadTask.snapshot.ref.getDownloadURL().then(function(url){
        imgUrl = url;
        console.log(imgUrl);

        // Add a new document in collection "cities"
        firebase.firestore().collection("toys").add({
            category: document.getElementById('toyCategory').value,
            imgurl: imgUrl,
            name: toyName,
            details: document.getElementById('toyDetails').value,
            productId: document.getElementById('toyProductId').value
        })
        .then(() => {
            popupAlert('New Toy record is added successfully', 'success')
            console.log("Document successfully written!");
        })
        .catch((error) => {
            popupAlert('Error in adding new Toy record', 'error')
            console.error("Error writing document: ", error);
        });

        });
      });
}


function renderNavBarLogin(){
  $("#navBarList").show();
  $("#login").show();
  $("#home").hide();
  $("#addToy").hide();
  $("#logout").hide();
  $("#LoginPanel").show();
  $("#HomePanel").hide();
  $("#AddToyPanel").hide();
}

function renderNavBarMain(){
  $("#navBarList").show();
  $("#login").hide();
  $("#home").show();
  $("#addToy").show();
  $("#logout").show();
  $("#LoginPanel").hide();
  $("#HomePanel").show();
  $("#AddToyPanel").hide();
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
  btn.href = "tel:+916238905264"
  
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

function popupAlert(msg, mType){
  if (mType == 'success'){
    $("#successMsg").html(msg);
    $("#successMsg").show();
    $("#errorMsg").hide();
    $("#successMsg").fadeTo(2000, 500).slideUp(500, function(){
      $("#successMsg").alert('close');
    });
  } else {
    $("#errorMsg").html(msg);
    $("#successMsg").hide();
    $("#errorMsg").show();
    $("#errorMsg").fadeTo(2000, 500).slideUp(500, function(){
      $("#errorMsg").alert('close');
    });   
  }
}