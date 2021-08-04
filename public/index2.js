window.onload = function()
{
    console.log("Testing window");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const location =  urlParams.get('location');
    console.log(queryString);
    console.log(location);
    // var url = new URL(window.location.href);
    // location = url.searchParams.get("location");
    // console.log(`Location is: ${location}`);

    firebase.auth().signInAnonymously()
    .then(() =>
    {
        console.log("Signed in");
    })
    .catch((error) =>
    {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`Error code ${errorCode}`);
        console.log(`Error message ${errorMessage}`);
    })

    firebase.auth().onAuthStateChanged((user) => 
    {
        if (user) 
        {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            // ...
            console.log("There is user");
            console.log(`And UID is ${uid}`);

            const redirectString = `https://qr-experiment.web.app/${location}/${uid}`;
            console.log(redirectString);
            window.location.href = redirectString;
        } 
        else 
        {
            // User is signed out
            // ...
            console.log("There is no user");
        }
    });
}