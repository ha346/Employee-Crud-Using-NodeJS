$(document).ready(function ()  {
    
    $.getJSON('/employee/fetchallstate', function (data) {
          
        data.map((item)=>{

            $('#state').append($('<option>').text(item.statename).val(item.stateid))
        })
        $('#state').formSelect()
    })


    $('#state').change(function () {
        
        $('#city').empty()

        $('#city').append($('<option disabled selected>').text('Choose your city'))

        $.getJSON('/employee/fetchallcity', { stateid: $('#state').val() }, function (data) {
            
            data.map((item) => {
              
                $('#city').append($('<option>').text(item.cityname).val(item.cityid))
            })
            $('#city').formSelect()
        })


    })



})