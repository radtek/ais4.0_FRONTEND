module.exports = config;

config.$inject = ['$urlRouterProvider', '$locationProvider', 'toastrConfig', 'moveableModalProvider', '$compileProvider'];

function config($urlRouterProvider, $locationProvider, toastrConfig, moveableModal, $compileProvider) {
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/');

    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });

    moveableModal.options = {
        elSelector: '.modal-header', // selector to select/click
        targetSelector: '.modal-content' // selector to be moved
    };
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|webshell|chrome-extension):/);
}