requirejs.config({
    'baseUrl': 'js',
    'paths': {
      'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min',
      'okta-config': 'config'
    }
});

var ID_TOKEN_KEY = 'id_token';

define(['jquery', 'okta-config'], function($, OktaConfig) {

  var oktaSignIn = new OktaSignIn({
    baseUrl: OktaConfig.orgUrl,
    clientId: OktaConfig.clientId,
    logo: '/images/acme_logo.png',
    registration: {
      //clientId: OktaConfig.clientId  
      click: function () {
            //window.location.href = 'https://acme.com/sign-up';
            window.location.href = 'http://localhost:8080/register.html';
        } },
    features: {
      registration: true,
      securityImage: false,
      rememberMe: true,
      smsRecovery: true,
      selfServiceUnlock: true,
      multiOptionalFactorEnroll: true
    },

    helpLinks: {
      help: 'http://example.com/custom/help/page',

      // Override default recovery flows with custom links
      // forgotPassword: 'http://example.com/custom/forgot/pass/page',
      // unlock: 'http://example.com/custom/unlock/page',

      // Add additional links to widget
      custom: [
        { text: 'custom link text 1', href: 'http://example.com/custom/link1' },
        { text: 'custom link text 2', href: 'http://example.com/custom/link2' }
      ]
    },

    // See dictionary of labels
    i18n: {
      en: {
        "primaryauth.title": "Acme Partner Login",
        "primaryauth.username": "Partner ID",
        "primaryauth.username.tooltip": "Enter your @example.com username",
        "primaryauth.password": "Password",
        "primaryauth.password.tooltip": "Super secret password"
      }
    },

    // Add Social IdPs (FACEBOOK, GOOGLE, or LINKEDIN)
    idps: [
      {
        type: 'GOOGLE',
        id: OktaConfig.idp
      }
    ],

    authParams: {
      scopes: OktaConfig.scopes,
      responseType: 'id_token'
    }
  });

  var resetDisplay = function() {
    //$('#claims').hide();
    //$('#actions').hide();
    //$('#api-resources').hide();
    //$('#error').hide();
  };

  var displayError = function(msg) {
    //$('#error').html('<p>'+ msg + '</p>');
    //$('#error').show();
  };

  var displayClaims = function(claims) {
    //$('#claims code').html(JSON.stringify(claims, null, '  '));
    //$('pre code').each(function(i, block) {
    //  hljs.highlightBlock(block);
    //});
    //$('#claims').show();
  };

  var displayActions = function(addSignInWidget) {
    //var actions = [];
    //if (addSignInWidget) {
    //  actions.push('<button id="btn-sign-in" type="button" class="btn">Sign-in with Account</button>');
    //}
    //actions.push('<button id="btn-sign-out" type="button" class="btn">Sign out</button>');
    //actions.push('<button id="btn-refresh" type="button" class="btn">Refresh Token</button>');

    //$('#actions').html(actions.join()).show();
  }

  var displayApiResources = function(idToken) {
    $('#error').hide();
    $.ajax({
        url : '/protected',
        headers: {
          Authorization: 'Bearer ' + idToken
        },
        processData : false,
    }).done(function(b64data){
      $('#api-resources')
        .html('<img src="data:image/png;base64,' + b64data + '">')
        .show();
    }).fail(function(jqXHR, textStatus) {
      var msg = 'Unable to fetch protected resource';
      msg += '<br>' + jqXHR.status + ' ' + jqXHR.responseText;
      if (jqXHR.status === 401) {
        msg += '<br>Your token may be expired'
      }
      displayError(msg);
    });
  };

  var renderWidget = function() {
    oktaSignIn.renderEl({
      el: '#widget',
    },
    // Success function - called at terminal states like authStatus SUCCESS or
    // when the recovery emails are sent (forgot password and unlock)
    function (res) {
      if (res.status === 'SUCCESS') {
        console.log('User %s succesfully authenticated %o', res.claims.email, res);
        oktaSignIn.tokenManager.add(ID_TOKEN_KEY, res);

        $('#widget').hide();
        $('#error').hide();
        displayClaims(res.claims);
        displayActions(false);
        displayApiResources(res.idToken);
      }
      else if (res.status === 'FORGOT_PASSWORD_EMAIL_SENT') {
        // res.username - value user entered in the forgot password form
        console.log('User %s sent recovery code via email to reset password', res.username);
      }
      else if (res.status === 'UNLOCK_ACCOUNT_EMAIL_SENT') {
        // res.username - value user entered in the unlock account form
        console.log('User %s sent recovery code via email to unlock account', res.username);
      }
    },
    // Error function - called when the widget experiences an unrecoverable error
    function (err) {
      // err is an Error object (ConfigError, UnsupportedBrowserError, etc)
      displayError('Unexpected error authenticating user: ' + err.message);
    });
  }

  $('body').on('click', '#btn-refresh', function() {
    oktaSignIn.tokenManager.refresh(ID_TOKEN_KEY).then(function(token) {
      displayClaims(token.claims);
    })
  });

  $('body').on('click', '#btn-sign-in', function() {
    resetDisplay();
    renderWidget();
  });

  $('body').on('click', '#btn-sign-out', function() {
    oktaSignIn.session.close(function() {
      oktaSignIn.tokenManager.clear();
      window.location.reload();
      });
  });

  oktaSignIn.session.get(function(session) {
    console.log(session);
    if (session.status === 'ACTIVE') {
      displayClaims(session);
      displayActions(true);
    } else {
      console.log('user does not have an active session @ %s', OktaConfig.orgUrl);
      renderWidget();
    }
  });


  $('#btn-reg').click(function () {
    var oktaurl = OktaConfig.orgUrl + "/api/v1/users?activate=false";
    var apiToken = "00aiVmxRp9BElWnbRqo9z8Evi4RFBbi7aeKKMefxra";

    //alert("oktaurl: " + oktaurl);

    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var email = $('#email').val();
    var userreg = $('#userreg').val();
    var mobilenumber = $('#mobilenumber').val();
    var passreg = $('#passreg').val();

    var jsondata = "{ \"profile\": { \"firstName\": \"" + firstname + "\",\"lastName\": \"" + lastname
    + "\",\"email\": \"" + email + "\",\"login\": \""
    + userreg + "\",\"mobilePhone\": \"" + mobilenumber
    + "\"},\"credentials\":{\"password\":{\"value\":\"" + passreg + "\"}}}"

    //alert("jsondata: " + jsondata);

    $.ajax({
        url: oktaurl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'SSWS ' + apiToken,
        },
        method: 'POST',
        dataType: 'json',
        data: jsondata,
        success: function (data) {
            alert("User has been created successfully" + JSON.stringify(data));
            //displayClaims(data);
        },
        error: function (data) {
            alert("error: " + JSON.stringify(data));
            //displayError(data.message);
            //displayClaims(JSON.stringify(data));
        }
    });
});


});
