$(document).ready(function () {

    let salt = "$2a$08$b0MHMsT3ErLoTRjpjzsCie";
    $('#submit').on('click', function () {
        name = $('#nm').val();
        hashpw($('#password').val(), salt, result, function() {});
        function result(newnum){
            if(newnum === '$2a$08$b0MHMsT3ErLoTRjpjzsCieW3cg.D3e9TSvGCk8FEEPOeb5FR2pO7O' && name === 'admin')
            {
                sessionStorage.setItem('num',newnum);
                window.location.replace("./dashboard.html");
            }
        }
    })

    $('[name=tab]').each(function (i, d) {
        var p = $(this).prop('checked');
        //   console.log(p);
        if (p) {
            $('article').eq(i).addClass('on');
        }
    });

    $('[name=tab]').on('change', function () {
        var p = $(this).prop('checked');

        // $(type).index(this) == nth-of-type
        var i = $('[name=tab]').index(this);

        $('.data__inner').removeClass('on');
        $('.data__inner').eq(i).addClass('on');
    });

    $('.dropify').dropify({
        messages: {
            'default': 'Drag and drop a file here or click',
            'replace': 'Drag and drop or click to replace',
            'remove':  'Remove',
            'error':   'Oops, something wrong happened.'
        }
    });

})