// var image_cropper;
//
// var interval
// var src_array = Array();
//
// //kzd  my fake data
//
// function pad_with_zeroes(number, length) {
//     var my_string = '' + number;
//     while (my_string.length < length) {
//         my_string = '0' + my_string;
//     }
//     return my_string;
// }
//
// database_list_json = [
//     "video_mall_180414",
//     "video_mall_180414_2",
//     "video_mall_180414_3",
// ]
// camera_list_json = []
// for (var i = 0; i < 5; i++) {
//     camera_list_json.push(pad_with_zeroes(i, 7))
// }
// video_list_json = [
//     "video_1",
//     "video_2",
//     "video_3",
//     "video_4",
// ]
// label_result_list_json = [
//     "张三",
//     "李四"
// ]
// current_id_list_json = []
// for (var i = 0; i < 500; i++) {
//     current_id_list_json.push("0001_date_" + pad_with_zeroes(i, 4))
// }
// kuma_url = "data:image/jpeg;base64,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"
// current_seletct_id_index = 0
// current_seletct_id_data =
//     {
//         id_name: "0001_date_0001",
//         image_dataurl_list: [],
//     }
//
// for (var i = 0; i < 100; i++) {
//     current_seletct_id_data.image_dataurl_list.push(kuma_url)
// }
//
//
// add_search_image('.selected_image', current_seletct_id_data.image_dataurl_list, "nanogallery_one", "0000", "time", "1")
// //$("#" + idname).nanogallery2('destroy')
// //add_search_image('.selected_image', current_seletct_id_data.image_dataurl_list, "nanogallery_one", "0000", "time", "1")
// current_labeled_same_id = []
// current_labeled_50_result = []
// for (var i = 0; i < 50; i++) {
//     current_labeled_50_result.push(current_seletct_id_data)
// }

NUM = 5;

$(function () {

});

function query_next() {
    if (g_mot_id_name_list.length == 0) {
        return
    }
    var current_mot_index = parseInt($('#id_list').val())
    if (current_mot_index == g_mot_id_name_list.length - 1) {
        current_mot_index = g_mot_id_name_list.length - 1
    }
    else{
        current_mot_index = current_mot_index + 1
    }
    $('#id_list').val(current_mot_index)
    query()
}

g_mot_id_name_list = []
function query() {

    if ($("#query").prop("disabled") == true){
        return
    }
    $("#query").prop("disabled",true)

    var selected_folder_path = $('#seleted_patch_path').val()
    var current_mot_id_name = $('#id_list').find('option:selected').text()
    console.log('query() current_mot_id_name', $('#id_list').find('option:selected').text())

    var dataurl='/query/';
    var data=JSON.stringify({
        selected_folder_path:selected_folder_path,
        current_mot_id_name:current_mot_id_name,
    });

    //https://code.ziqiangxuetang.com/django/django-csrf.html
    jQuery(document).ajaxSend(function(event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        function sameOrigin(url) {
            // url could be relative or scheme relative or absolute
            var host = document.location.host; // host + port
            var protocol = document.location.protocol;
            var sr_origin = '//' + host;
            var origin = protocol + sr_origin;
            // Allow absolute or scheme relative URLs to same origin
            return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                // or any other URL that isn't scheme relative or absolute i.e relative.
                !(/^(\/\/|http:|https:).*/.test(url));
        }
        function safeMethod(method) {
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

        if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    });

    $.ajax({
        url:dataurl,
        contentType: 'application/json; charset=utf-8',
        data:data,
        type:'POST',
        success:function(data){
            var json_data=JSON.parse(data)

            var current_mot_id_img_url_list = json_data['current_mot_id_img_url_list']
            var current_mot_id_img_filename_list = json_data['current_mot_id_img_filename_list']
            var current_mot_id_name  = json_data['current_mot_id_name']
            var mot_id_name_list = json_data['mot_id_name_list']
            g_mot_id_name_list = mot_id_name_list
            $('#id_list').empty()
            $.each(mot_id_name_list, function (i, id_name) {
                $("#id_list").append("<option value=" + i + ">" + id_name + "</option>");
            });

            $('#id_list').val(mot_id_name_list.indexOf(current_mot_id_name));
            $('#seleted_id').val('MOT_ID_' + current_mot_id_name);


            $('#id_list').on('change', function(e){
                //console.log("$('#id_list').on('change', function(){")
                if (e.originalEvent) {
                    console.log("$('#id_list').on('change', function(){")
                    query()
                }
            })

            add_search_image('.selected_image', current_mot_id_img_url_list, 'nanogallery_one' + NUM,
                                current_mot_id_img_filename_list)
            NUM = NUM + 1

            $("#query").prop("disabled",false)
        },
        error:function(data){
            console.log('get_video_labelperson_list is wrong');
            //console.log(data)
            console.log(data)
            alert('获取数据出错，请检查路径')
            top.location.reload()
            $("#query").prop("disabled",false)

        }
    });
}




function add_search_image(select, src_set, idname, current_mot_id_img_filename_list) {
    //add_search_image('.selected_image',src_array,'nanogallery0");
    $(select).html('<div id="' + idname + '" style="margin-top: 15px"></div>');
    var items = Array();
    $.each(src_set, function (i, src) {
        items.push({
            src: src,
            srct:src,
            title: current_mot_id_img_filename_list[i].split("_")[3],
            description: current_mot_id_img_filename_list[i],
        })
    });
    //jQuery("#" + idname).nanogallery2('destroy')
    jQuery("#" + idname).nanogallery2({
        <!-- ### gallery settings ### -->
        "colorScheme": {
            "thumbnail": {
                "background": "rgba(255,255,255,1)",
                "borderColor": "rgba(217,237,247,1)"
            }
        },
        "thumbnailAlignment": "center",
        "thumbnailBorderVertical": 2,
        "thumbnailBorderHorizontal": 2,
        "thumbnailHoverEffect2": "image_scale_1.0_1.1",
        "thumbnailHeight": 190,
        "thumbnailWidth": 110,
        "galleryResizeAnimation ":false,
        "thumbnailLabel": {
            "align": "left",
            "position": "onBottom",
            "displayDescription": true,
        },
        "galleryMaxRows": 4,
        "thumbnailLabel": {"position": "overImageOnBottom", "hideIcons": true, "display": true},
        "galleryDisplayMode": "pagination",
        //"galleryPaginationMode": "numbers",
        //"displayDescription": false,
        "thumbnailGutterWidth": 5,
        "thumbnailOpenImage": true,
        "thumbnailCrop": false,
        "eventsDebounceDelay":0,
        "galleryRenderDelay":0,
        "thumbnailDisplayInterval":0,
        "thumbnailDisplayTransition":"fadeIn",
        "thumbnailDisplayOutsideScreen":false,
        "galleryDisplayTransitionDuration":0,
        "thumbnailSliderDelay":0,
        "displayBreadcrumb":false,
        //"thumbnailCrop": false,
        /*"thumbnailGutterWidth": 25,
        "thumbnailGutterHeight": 20,
        "itemsBaseURL": "",
        thumbnailToolbarImage: {topLeft: 'cart'},*/
        //icons: {
        //    thumbnailCart: '<span class="fa-stack fa-sm" ><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse" onclick="select_query_image(this)"></i></span>'
        //},
        //"fnThumbnailInit": ImgDisplayed,
        items: items

    });
}





