window.onload = function()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const location =  urlParams.get('location');

    firebase.auth().signInAnonymously()
    .then(() =>
    {

    })
    .catch((error) =>
    {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(`Error code ${errorCode}`);
        console.log(`Error message ${errorMessage}`);
    })

    firebase.auth().onAuthStateChanged((user) => 
    {
        if (user) 
        {
            let uid = user.uid;

            let redirectString = "https://qr-experiment.web.app";

            const params = urlParams.values();
            for (const value of params)
            {
                redirectString = redirectString + '/' + value;
            }

            redirectString = redirectString + '/' + uid;

            window.location.href = redirectString;
        } 
        else 
        {
        }
    });
}