$(document).on("ready", ini);

function ini()
{
    $('#excel').on('click', prExportar);    
}

function prExportar()
{
    $('<iframe src="../ExportarOU"></iframe>').appendTo('body').hide();
}
   