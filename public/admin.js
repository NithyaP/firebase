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
      alert('error in upoading the image');
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
            console.log("Document successfully written!");
        })
        .catch((error) => {
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
