$(function() {
    $('.scroll-down').click (function() {
        $('html, body').animate({scrollTop: $('.footer').offset().top }, 'slow');
        return false;
    });
});

function showPassword() {
    
    var password_attr = $('#password').attr('type');
    
    if(password_attr != 'text') {
        
        $('.checkbox').addClass('show');
        $('#password').attr('type', 'text');
        
    } else {
        
        $('.checkbox').removeClass('show');
        $('#password').attr('type', 'password');
        
    }
    
}