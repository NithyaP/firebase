document.addEventListener("DOMContentLoaded",event =>{
    const app= firebase.app();
    const db = firebase.firestore();
    const myPost = db.collection('toys').doc('oBrxpk38WHORPTpTWKgf');
    myPost.get()
          .then(doc => {
              const data = doc.data();
              
              
              document.getElementById("title").innerHTML = data.name;
              document.getElementById("price").innerHTML = data.price;

          })

});