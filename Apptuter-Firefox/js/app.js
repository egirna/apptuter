$(function () {

    /*************** Start Events Handler ***************/
    /* Show App Info */
    $('#btn-showInfo').click(function () {
        showSection('#appInfo');
    })

    /* Hide App Info */
    $('#btn-info-back').click(function () {
        hideSection('#appInfo');
    })

    /*Return Back to setting screen*/
    $('#btn-home-back').click(function (evt) {
        window.close();
    })

    /*************** End Events Handler ***************/
})

/*************** Strat Functions ***************/

/* Show Desired Section */
function showSection(_id) {
    $(_id).removeClass('right').addClass('current');
    $('[data-position="current"]').removeClass('current').addClass('left');
}

/* Hide Desired Section */
function hideSection(_id) {
    $(_id).removeClass('current').addClass('right');
    $('[data-position="current"]').removeClass('left').addClass('current');
}
/*************** End Functions  ***************/