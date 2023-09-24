var openModalButton = $('.open-Modal-Button');
var closeModalButton = $('.close-Modal-Button');
var modal = $('.modal');
 
function closeModal() {
    $(modal).hide();
}

$(document).ready
function openModal() {
    $(modal).show();
}
    
$(closeModalButton).on('click', closeModal);
$(openModalButton).on('click', openModal);
