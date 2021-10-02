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


var reader = new FileReader();
// const db = firebase.firestore();
document.getElementById("home").onclick = function(e){
  document.getElementById("HomePanel").style.display = "inline-block";
  document.getElementById("AddToyPanel").style.display = "none"
}
document.getElementById("addToy").onclick = function(e){
  document.getElementById("HomePanel").style.display = "none";
  document.getElementById("AddToyPanel").style.display = "inline-block"
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
