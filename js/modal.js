
var openModalButton = $('#about-btn');
var closeModalButton = $('.close-Modal-Button');
var modal = $('#modal');
var aboutBtn = $('#about-btn');

function closeModal() {
    $(modal).hide();
 }

function openModal() {
    $(modal).show().removeClass('hide');
    
}
    
 $(closeModalButton).on('click', closeModal);
 $(openModalButton).on('click', openModal);




  
    
  
 