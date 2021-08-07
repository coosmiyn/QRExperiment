window.onload = function()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const location =  urlParams.get('location');

    // Sign in the user automatically and anonymous
    // No credentials needed, it all works without user input
    firebase.auth().signInAnonymously()
    .then(() => {

    })
    .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(`Error code ${errorCode}`);
        console.log(`Error message ${errorMessage}`);
    })

    // Once the user is logged in, they will be assigned an unique session ID, which can be passed in the back end for logging only unique devices and not any access
    firebase.auth().onAuthStateChanged((user) =>  {
        if (user) {
            let uid = user.uid;

            let redirectString = "https://qr-experiment.web.app" + '/' + uid;

            // Build the string based on the URL parameters.
            // Function supports future changes to the URL, 
            const params = urlParams.values();
            for (const value of params)
            {
                redirectString = redirectString + '/' + value;
            }

            window.location.href = redirectString;
        } 
        else {
        }
    });
}