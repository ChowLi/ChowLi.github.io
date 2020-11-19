//1. Log In, Register, My Profile and Logout functionality using screen sets - just set the apiKey in index.html
// 2. Languages of English, Chinese and Russian, including setting the correct social networks - make sure you leave the social network widget in the screen sets having no explicit social networks defined, as per the docs.
// 3. JWT Token support - an ID token is automatically added as a cookie when the user logs in or a page is refreshed with a logged in state
 
jQuery(document).ready(function () {
    $("#logInLinks").show();
    $("#loggedInLinks").hide();
  
    // add the event handlers we need for login, logout and profile update
    gigya.accounts.addEventHandlers({ onLogin: onLoginHandler, onLogout: onLogoutHandler });
    gigya.accounts.getAccountInfo({ callback: getAccountInfoResponse, include: 'profile,data' });
});
 
function getAccountInfoResponse(response) {
    setLoggedInState(response);
}
 
function onLoginHandler(response) { // login callback function
    getJWT(); // we get an ID Token and set it as a cookie, just in case we need to show this in the demo - NOTE, the Gigya SDK uses the GLT_ cookie for session management, not this ID Token
    setLoggedInState(response);
}
 
function setLoggedInState(response) {
    // this is the main function that sets the logged in state, whether it be via a login or just a page refresh
    if (response.UID) {
        var thumbnailURL = response.profile.thumbnailURL;
        if (thumbnailURL == undefined) {
            thumbnailURL = response.profile.photoURL;
            if (thumbnailURL == undefined) thumbnailURL = "https://cdns.gigya.com/site/images/UserManagement/profile_default_pic.png";
        }
        $("#profilePic").html('<img src="' + thumbnailURL + '" class="profilePic"/>');
        $("#welcome").html('Welcome ' + response.profile.firstName);
        $("#logInLinks").hide();
        $("#loggedInLinks").show();
    }
}
 
function showLogin() {
    var params;
    /*var socialProviders = 'facebook,twitter,googleplus';*/
 
  
     params = {
        screenSet: 'ChowLi-Registration Login'
      /*  , enabledProviders: socialProviders*/
    }
    gigya.accounts.showScreenSet(params);
}
 
function showRegister() {
    var params;
 
    /*var socialProviders = 'facebook,twitter,googleplus';*/
 
  
    params = {
        screenSet: 'ChowLi-Registration Login'
        , startScreen: 'gigya-register-screen'
    /*    , enabledProviders: socialProviders*/
        , "onBeforeSubmit" : checkSubmit
    }
    gigya.accounts.showScreenSet(params);
}

function checkSubmit(event){
 if(event.formData["profile.firstName"].length < 3){
    alert("Please enter a longer name"); return false;
 }
 return true;
}

 
function getJWT() {
    gigya.accounts.getJWT({ fields: 'profile.firstName,profile.lastName,profile.email', expiration: 60, callback: getJWTResponse });
}
 
function getJWTResponse(response) {
    document.cookie = "jwt_id_token=" + response.id_token;
}
 
function logout() {
    gigya.accounts.logout(); // logout from Gigya platform, 
}
 
function onLogoutHandler() { // logout callback function
    $("#logInLinks").show();
    $("#loggedInLinks").hide();
     
    document.cookie = "jwt_id_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    alert("You are now logged out.");
    window.location = "/";
}
 
// helper functions:
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
 
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
