(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.OktaConfig = factory();
  }
}(this, function () {

    return {
        orgUrl: 'https://devdcirecondo.okta.com',
        apiToken: '00aiVmxRp9BElWnbRqo9z8Evi4RFBbi7aeKKMefxra',
        authzIssuer: 'https://devdcirecondo.okta.com/oauth2/aus3rfvv75UZKWqcX1t7',
        clientId: '0oa3l0wfqGvduxLh72p6',
        idp: '0oa3lbp51Sb38fzbo2p6',
        scopes: ['openid', 'email', 'profile', 'phone', 'address', 'groups'],
        protectedScope: 'api:read'
    };

}));
