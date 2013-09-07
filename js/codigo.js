$(document).on("ready", ini);

function ini()
{
    $("#abre-menu").on("mouseenter", prAbreMenu);
    $("#menu").on("mouseleave", prMenuPierdeFoco);
}

function prAbreMenu()
{
    $("#menu").animate({
        left: 40
    },1000);

    $("#tabla").animate({
        opacity: 0.25
    },1000);
}

function prMenuPierdeFoco()
{
    $("#menu").animate({
        left: -400
    });

    $("#tabla").animate({
        opacity: 1
    },1000);
}