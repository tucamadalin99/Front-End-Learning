window.onload = () => {
    var firebaseConfig = {
        apiKey: "AIzaSyDAURzkKmtpLsBGNYYt1Sj6-pTmk7lh6Wg",
        authDomain: "ibm-frontend.firebaseapp.com",
        databaseURL: "https://ibm-frontend-default-rtdb.firebaseio.com",
        projectId: "ibm-frontend",
        storageBucket: "ibm-frontend.appspot.com",
        messagingSenderId: "185203005676",
        appId: "1:185203005676:web:b77b0a61affd56af9c6dc9",
        measurementId: "G-0LV3RBN6J8"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    console.log("Init");
    const user = {
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password")
    }
    let userCart = {};
    if (user.password === "user" && user.username === "user" && user.id !== null) {
        console.log(user);
        const dbRef = firebase.database().ref(`${user.id}`);
        dbRef.on('value', async (snapshot) => {
            userCart = await snapshot.val();
            document.querySelector(".cart-link").childNodes[1].nodeValue = `Cart ($${userCart.cartPrice.toFixed(2)})`
        })
    } else {
        console.log("Auth failed, no user in local storage")
    }
}