$('document').ready(function(){
    $('.del-post').on("click",function(e){
        $target=$(e.target);
        const id=$target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/home/'+id,
            success:function(response){
                alert('Article Deleted');

                window.location.replace('/home');
            }
        })
    });
    $('.add-follower').on("click",function(e){
        $target=$(e.target);
        const id=$target.attr('data-id');
        $.ajax({
            type:'GET',
            url:'/users/follow/'+id,
            success:function(response){
                alert('USer followed');

                //window.location.reload();
            }
        })
    });
    $('.del-account').on("click",function (e) {
        $target=$(e.target);
        const id=$target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/users/'+id,
            success:function(response){
                alert('Account Deleted');

                window.location.replace('/home');
            }
        });
    });
    $('.content').on('submit', function(){

        var item = $('.content');
        var comment = {item: item.val()};

        $.ajax({
            type: 'POST',
            url: '/home',
            data: comment,
            success: function(data){
                //do something with the data via front-end framework
                alert(data);
            }
        });

        return false;

    });
});