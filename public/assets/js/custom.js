function toggleDiv(){

    if ($(window).width() < 768) {

            $("nav.navbar-default").hide();

    }else{

        $("nav.navbar-default").show();

    }

}

$(document).ready(function () {
    toggleDiv();

    $(window).resize(function(){
        toggleDiv();
    });

});

// function showPassword() {
    
//     var key_attr = $('#key').attr('type');
    
//     if(key_attr != 'text') {
        
//         $('.checkbox').addClass('show');
//         $('#key').attr('type', 'text');
        
//     } else {
        
//         $('.checkbox').removeClass('show');
//         $('#key').attr('type', 'password');
        
//     }
    
// }