$(function () {
    $('#saveSetting').on('click', processSettings);

    if (localStorage.getItem('pageName') != null)
        $("#txt_pagename").val (localStorage.getItem('pageName'));
});

function processSettings(evt) {
    evt.preventDefault();

    //change page name
    var pageName = $("#txt_pagename").val();
    //Show loading widget
    $('progress:not([value])').css('display', 'inline-block');
 
    //Creating AJAX Call to assure that page exist.
    $.ajax({
        url: "https://graph.facebook.com/" + pageName,
        dataType: 'json',
        success: function (content) {
            if (content.id) {
                localStorage.setItem('pageid', content.id);
                localStorage.setItem('pageName', pageName);

               
                setTimeout(function () {
                    var ref = window.open("../index.html", "_self");
                    //Hide loading widget
                    $('progress:not([value])').css('display', 'none');
                }, 300);
            }
        },
        error: function (e, er, err) {
            
            if (e.status == 404) {
                $('progress:not([value])').css('display', 'none');
                alert("Please enter a valid Facebook page")
            }
            else {
                $('progress:not([value])').css('display', 'none');
                alert("Network error occurred, Please check your Internet Connection & try again later");
            }
    }
    });
}

//handling saving records of entered pages
function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        var month = '0' + month;
    }
    if (day.toString().length == 1) {
        var day = '0' + day;
    }
    if (hour.toString().length == 1) {
        var hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        var minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        var second = '0' + second;
    }
    var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    return encodeURIComponent(dateTime);  //escaping slash char then decoding it in php
}
