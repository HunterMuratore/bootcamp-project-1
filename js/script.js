
var openModalButton = $('.open-Modal-Button');
var closeModalButton = $('.close-Modal-Button');
var modal = $('.modal');

//function to close modal
//click event listener on the close button- done
 
 function closeModal() {
    $(modal).hide();
 }

$(document).ready
function openModal() {
    $(modal).show();
}
    
 $(closeModalButton).on('click', closeModal);
 $(openModalButton).on('click', openModal);




  
    
  
