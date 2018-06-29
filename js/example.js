

// from http://www.mediacollege.com/internet/javascript/number/round.html
function roundNumber(number,decimals) {
  var newString;// The new rounded number
  decimals = Number(decimals);
  if (decimals < 1) {
    newString = (Math.round(number)).toString();
  } else {
    var numString = number.toString();
    if (numString.lastIndexOf(".") == -1) {// If there is no decimal point
      numString += ".";// give it one at the end
    }
    var cutoff = numString.lastIndexOf(".") + decimals;// The point at which to truncate the number
    var d1 = Number(numString.substring(cutoff,cutoff+1));// The value of the last decimal place that we'll end up with
    var d2 = Number(numString.substring(cutoff+1,cutoff+2));// The next decimal, after the last one we want
    if (d2 >= 5) {// Do we need to round up at all? If not, the string will just be truncated
      if (d1 == 9 && cutoff > 0) {// If the last digit is 9, find a new cutoff point
        while (cutoff > 0 && (d1 == 9 || isNaN(d1))) {
          if (d1 != ".") {
            cutoff -= 1;
            d1 = Number(numString.substring(cutoff,cutoff+1));
          } else {
            cutoff -= 1;
          }
        }
      }
      d1 += 1;
    } 
    if (d1 == 10) {
      numString = numString.substring(0, numString.lastIndexOf("."));
      var roundedNum = Number(numString) + 1;
      newString = roundedNum.toString() + '.';
    } else {
      newString = numString.substring(0,cutoff) + d1.toString();
    }
  }
  if (newString.lastIndexOf(".") == -1) {// Do this again, to the new string
    newString += ".";
  }
  var decs = (newString.substring(newString.lastIndexOf(".")+1)).length;
  for(var i=0;i<decimals-decs;i++) newString += "0";
  //var newNumber = Number(newString);// make it a number if you like
  return newString; // Output the result to the form field (change for your purposes)
}

$.fn.digits = function(){ 
  return this.each(function(){ 
      $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
  })
}


function update_total() {
  var total = 0;
  $('.price').each(function(i){
    price = $(this).html().replace("$","");
    if (!isNaN(price)) total += Number(price);
  });

  total = roundNumber(total,2);

  $('#subtotal').html(total);
  $('#total').html(total);
  
  update_balance();
}

function update_balance() {
  
  var total = $("#total").html().replace("$","");
  var paid = $("#paid").val().replace("$","");
  var arzesh =  $("#arzesh").val().replace("%","") / 100  ; 
      arzesh = parseFloat(arzesh*total) ;  
      arzesh = parseFloat(+total+arzesh) ;     
  var due =  arzesh - paid ;


  due = roundNumber(due,2);
  
  $('.due').html(due).digits();
}

function update_price() {
  var row = $(this).parents('.item-row');
  var price = row.find('.cost').val().replace("$","") * row.find('.qty').val();
  price = roundNumber(price,2);
  isNaN(price) ? row.find('.price').html("N/A") : row.find('.price').html(price);
  
  update_total();
}

function bind() {
  $(".cost").blur(update_price);
  $(".qty").blur(update_price);
}
 
$(document).ready(function() {

  $('input').click(function(){
    $(this).select();
  });

  $("#paid").blur(update_balance);
  $("#arzesh").blur(update_balance);
   
  $("#addrow").click(function(){
    $(".item-row:last").after('<tr class="item-row"><td>'+$(this).closest("tr").index() 
    +'<div class="delete-wpr"><a class="delete" href="javascript:;" title="Remove row">X</a></div></td>'
    +'<td class="item-name"><textarea>نام کالا</textarea></td>'
    +'<td><textarea class="cost">0</textarea></td>'
    +'<td><textarea class="qty">1</textarea></td>'
    +'<td><span class="price">0</span></td></tr>');

    if ($(".delete").length > 0) $(".delete").show();
    bind();
  });
  
  bind();
  
  $("#items").on('click','.delete',function(){
    $(this).parents('.item-row').remove();
    update_total();
    if ($(".delete").length < 2) $(".delete").hide();
  });
  
  $("#cancel-logo").click(function(){
    $("#logo").removeClass('edit');
  });
  $("#delete-logo").click(function(){
    $("#logo").remove();
  });
  $("#change-logo").click(function(){
    $("#logo").addClass('edit');
    $("#imageloc").val($("#image").attr('src'));
    $("#image").select();
  });
  $("#save-logo").click(function(){
    $("#image").attr('src',$("#imageloc").val());
    $("#logo").removeClass('edit');
  });

   

  $("#date").pDatepicker({
    format: 'YYYY/M/D' 
  });
  
});