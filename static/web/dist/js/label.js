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

g_current_inited_gallery_id_list = []
g_current_refreshed_gallery_id_list = []

g_database_list_json = []
g_database_camera_dict_json = {}
$(function () {
    // using ajax to get database and camera list
    var dataurl = '/get_database_camera_list/';
    $.ajax({
        url: dataurl,
        type: "GET",
        success: function (data) {
            var json_data = JSON.parse(data)

            $.each(json_data['database_list'], function (i, database_name) {
                g_database_list_json.push(database_name);
                g_database_camera_dict_json[database_name] = json_data['database_camera_list'][i]
            });

            $.each(g_database_list_json, function (i, database_name) {
                $("#database_list").append("<option value=" + i + ">数据源：" + database_name + "</option>");
                if (i == 0) {
                    $("#database_list").val(i);
                }
            });
            if (g_database_list_json.length > 0) {
                $.each(g_database_camera_dict_json[g_database_list_json[0]], function (i, camera_name) {
                    $("#camera_list").append("<option value=" + i + ">" + camera_name + "</option>");
                });
            }

        },
        error: function (data) {
            console.log("get_database_camera_list is wrong");
            //console.log(data)
            console.log(data)
            alert("获取数据库和相机列表出错，请登陆，或联系管理员")
            //loading.stop()
        }
    });

    // logic for database change
    $("#database_list").change(function () {
        $("#camera_list").empty()
        $.each(g_database_camera_dict_json[g_database_list_json[parseInt($("#database_list").val())]], function (i, camera_name) {
            $("#camera_list").append("<option value=" + i + ">" + camera_name + "</option>");
        });
        $("#seleted_camera").val("当前相机");
        //TODO: add logic to clear all gallery
    })

    // init all 50 gallery
    all_gallery_html = ""
    for (var i = 0; i < 25; ++i) {
        left_container_id = "nanogallery2_container" + (i * 2)
        right_container_id = "nanogallery2_container" + (i * 2 + 1)
        //left_gallery_id = "nanogallery2_gallery" + i * 2
        //right_gallery_id = "nanogallery2_gallery" + i * 2 + 1
        left_checkbox_id = "nanogallery2_checkbox" + (i * 2)
        right_checkbox_id = "nanogallery2_checkbox" + (i * 2 + 1)
        all_gallery_html = all_gallery_html + '<div class="row"><div class="col-md-6"><div class="row"><div class="col-md-11"><div class="card card-primary border border-white"><div class="nano_gallery_box" id="'

            + left_container_id + '"><div id="nanogallery2_text"></div></div></div></div><div class="col-md-1"><input class="form-check-input " type="checkbox" id="'
            + left_checkbox_id + '" style="width:60%; height:60%;margin-top:50%;margin-left:-10%"></div></div></div><div class="col-md-6"><div class="row"><div class="col-md-1"><input class="form-check-input " type="checkbox" id="'
            + right_checkbox_id + '" style="width:60%; height:60%;margin-top:50%;margin-left:15%"></div><div class="col-md-11"><div class="card card-primary border border-white "><div class="nano_gallery_box" id="'
            + right_container_id + '"><div id="nanogallery2_text"></div></div></div></div></div></div></div>'

    }
    $("#gallery_list").html(all_gallery_html)

    // init 50checkbox border color hint
    for (var i = 0; i < 25; ++i) {
        left_checkbox_id = "nanogallery2_checkbox" + (i * 2)
        right_checkbox_id = "nanogallery2_checkbox" + (i * 2 + 1)
        $("#" + left_checkbox_id).change(function () {
            console.log($("#" + this.id).is(':checked'))
            if ($("#" + this.id).is(':checked')) {
                //console.log(this.id + "left_checkbox_id checked")
                $("#" + "nanogallery2_container" + this.id.slice(21)).parent().removeClass('border-white')
                $("#" + "nanogallery2_container" + this.id.slice(21)).parent().addClass('border-primary')
            } else {
                //console.log(this.id + "left_checkbox_id unchecked")
                $("#" + "nanogallery2_container" + this.id.slice(21)).parent().removeClass('border-primary')
                $("#" + "nanogallery2_container" + this.id.slice(21)).parent().addClass('border-white')
            }
        });
        $("#" + right_checkbox_id).change(function () {
            if ($("#" + this.id).is(':checked')) {
                //console.log(this.id + "right_checkbox_id checked")
                $("#" + "nanogallery2_container" + this.id.slice(21)).parent().removeClass('border-white')
                $("#" + "nanogallery2_container" + this.id.slice(21)).parent().addClass('border-primary')
            } else {
                //.log(this.id + "right_checkbox_id unchecked")
                $("#" + "nanogallery2_container" + this.id.slice(21)).parent().removeClass('border-primary')
                $("#" + "nanogallery2_container" + this.id.slice(21)).parent().addClass('border-white')
            }
        });
    }

    // default jump labeled ones
    $("#jump_labeled_ones").prop('checked', true)

    // // local debug nanogallery show
    // for (var i = 0; i < 50; i++) {
    //     //console.log('#nanogallery2_container' + i)
    //     //$('#nanogallery2_container' + i).html("");
    //
    //     var src_array = new Array();
    //     var frame_array = new Array()
    //     var score_set = new Array()
    //     var frame_datetime_set = new Array()
    //     var camera_position_set = new Array()
    //     for (var j = 0; j < 6; j++) {
    //         src_array.push(kuma_url)
    //         frame_array.push(kuma_url)
    //         score_set.push(1)
    //         frame_datetime_set.push("2018-07-12 19:48:47")
    //         camera_position_set.push("0")
    //     }
    //     NUM = NUM + 1
    //     add_query_result_image('#nanogallery2_container' + i, src_array, frame_array, score_set, frame_datetime_set, camera_position_set, 'nanogallery2_container_show' + NUM);
    //
    //     //demo();
    // }

});


g_video_list_json = []
g_video_labelman_dict_json = {}
g_video_id_list_json = []
g_remote_same_id_index_list_json = []
g_last_top_50_id_name = []

//TODO: might reduce global var
g_current_id_index = 0
g_last_corrected_id_index = -1
g_last_corrected_same_id_name_list_json = []

function from_liangjiang_filename_to_localtime(file_name) {
    var timestamp = file_name.split('_')[2]
    var timestamp_int = parseInt(timestamp)
    var timestamp_int_local_ms = timestamp_int
    var date = new Date(timestamp_int_local_ms);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}


function get_all_data(
    current_database_name,
    current_camera_name,
    current_video_name,
    current_labelperson_name,
    trigger_by_button
) {
    var dataurl='/get_all_data/';

    // console.log("$(\"#confirm_current_label\").prop(\"disabled\",true)")
    if ($("#confirm_current_label").prop("disabled") == true){
        return
    }
    $("#confirm_current_label").prop("disabled",true)

    var is_bad_quality= $("#bad_quality").is(':checked')
    $("#bad_quality").prop('checked', false)

    var is_jump_labeled_ones= $("#jump_labeled_ones").is(':checked')

    var data=JSON.stringify({
        current_database_name:current_database_name,
        current_camera_name:current_camera_name,
        current_video_name:current_video_name,
        current_labelperson_name:current_labelperson_name,
        current_id_index:g_current_id_index,
        last_corrected_id_index:g_last_corrected_id_index,
        last_corrected_same_id_name_list_json:g_last_corrected_same_id_name_list_json,
        trigger_by_button:trigger_by_button,
        is_bad_quality:is_bad_quality,
        is_jump_labeled_ones:is_jump_labeled_ones,
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

    // ajax get_all_data

    // var current_database_name = $("#database_list").find("option:selected").text().slice(4)
    // var current_camera_name = $("#camera_list").find("option:selected").text()


    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var json_data=JSON.parse(data)

            var video_list = json_data['video_list']
            var vieo_labelperson_list = json_data['vieo_labelperson_list']

            var video_id_str_list = json_data['video_id_str_list']
            var top_50_img_url_list = json_data['top_50_img_url_list']
            var current_mot_id_img_url_list = json_data['current_mot_id_img_url_list']
            var top_50_is_same_id  = json_data['top_50_is_same_id']
            var top_50_id_name  = json_data['top_50_id_name']
            var current_id_index  = json_data['current_id_index']
            var all_history_index  = json_data['all_history_index']
            var top_50_distance  = json_data['top_50_distance']

            var current_id_is_bad  = json_data['current_id_is_bad']
            if (current_id_is_bad) {
                $("#bad_quality").prop('checked', true)
            }else{
                $("#bad_quality").prop('checked', false)
            }

            var top_50_img_file_name_list  = json_data['top_50_img_file_name_list']
            var current_mot_id_img_file_name_list  = json_data['current_mot_id_img_file_name_list']

            g_last_top_50_id_name  = top_50_id_name

            if (current_video_name == ""){
                g_video_list_json = []
                g_video_labelman_dict_json = {}
                $.each(video_list, function (i, video_name) {
                    g_video_list_json.push(video_name);
                    g_video_labelman_dict_json[video_name] = vieo_labelperson_list[i]
                });
                if (g_video_list_json.length == 0) {
                    alert("当前摄像机下没有视频列表，请联系管理员")
                    return
                }
                $("#video_list").empty()
                $.each(g_video_list_json, function (i, video_name) {
                    $("#video_list").append("<option value=" + i + ">" + video_name + "</option>");
                });
                current_video_name = $("#video_list").find("option:selected").text()
            }
            //console.log($("#video_list").find("option:selected").text())

            if (current_labelperson_name == ""){
                $("#label_result_list").empty()
                if (!(current_video_name in g_video_labelman_dict_json)) {
                    alert("当前摄像机下没有标注，请联系管理员")
                    return
                }
                $.each(g_video_labelman_dict_json[current_video_name], function (i, laberperson_name){
                    $("#label_result_list").append("<option value=" + i + ">" + laberperson_name + "</option>");
                });
                current_labelperson_name = $("#label_result_list").find("option:selected").text()
            }
            //console.log($("#label_result_list").find("option:selected").text())

            if (g_last_corrected_id_index == -1 || g_current_id_index == 0){
                $("#id_list").empty()
                g_video_id_list_json = video_id_str_list
                all_id_length = video_id_str_list.length
                $.each(video_id_str_list, function (i, id_name) {
                    $("#id_list").append("<option value=" + i + ">" + i + "/" + all_id_length + "</option>");
                });
            }
            g_current_id_index = current_id_index
            $("#id_list").val(g_current_id_index);
            $("#seleted_id").val("ID_" + video_id_str_list[g_current_id_index] + "__" + current_video_name);

            g_current_inited_gallery_id_list = []
            g_current_refreshed_gallery_id_list = []
            add_search_image('.selected_image', current_mot_id_img_url_list, "nanogallery_one" + NUM,
                                current_video_name, video_id_str_list[g_current_id_index], g_current_id_index, current_mot_id_img_file_name_list)

            for (var i = 0; i < 50; i++) {
                //console.log('#nanogallery2_container' + i)
                $('#nanogallery2_container' + i).html("");

                var src_array = new Array();
                var frame_array = new Array()
                var score_set = new Array()
                var frame_datetime_set = new Array()
                var camera_position_set = new Array()

                if (i < top_50_img_url_list.length) {
                    for (var j = 0; j < top_50_img_url_list[i].length; j++) {
                        src_array.push(top_50_img_url_list[i][j])
                        frame_array.push(top_50_img_url_list[i][j])
                        score_set.push(1)
                        frame_datetime_set.push(top_50_img_file_name_list[i][j])
                        camera_position_set.push(top_50_distance[i] +
                            "  index_" + parse_index_from_name(top_50_id_name[i], video_id_str_list) +
                            "_id_name_" + top_50_id_name[i] + '  ' + from_liangjiang_filename_to_localtime(top_50_img_file_name_list[i][j]))
                    }
                }

                NUM = NUM + 1
                add_query_result_image('#nanogallery2_container' + i, src_array, frame_array, score_set, frame_datetime_set, camera_position_set, 'nanogallery2_container_show' + NUM);
                jQuery("#" + ('nanogallery2_container_show' + NUM - 50)).nanogallery2('destroy')
                //demo();
            }

            for (var i = 0; i < 50; ++i) {
                var checkbox_id = "nanogallery2_checkbox" + i
                if (i < top_50_img_url_list.length) {
                    if (top_50_is_same_id[i] == 1) {
                        if (!($("#" + checkbox_id).is(':checked'))) {
                            //console.log(this.id + "left_checkbox_id checked")
                            $("#" + "nanogallery2_container" + checkbox_id.slice(21)).parent().removeClass('border-white')
                            $("#" + "nanogallery2_container" + checkbox_id.slice(21)).parent().addClass('border-primary')
                        }
                        $("#" + checkbox_id).prop('checked', true)
                    } else {
                        if ($("#" + checkbox_id).is(':checked')) {
                            //console.log(this.id + "left_checkbox_id checked")
                            $("#" + "nanogallery2_container" + checkbox_id.slice(21)).parent().removeClass('border-primary')
                            $("#" + "nanogallery2_container" + checkbox_id.slice(21)).parent().addClass('border-white')
                        }
                        $("#" + checkbox_id).prop('checked', false)
                    }
                }else{
                    if ($("#" + checkbox_id).is(':checked')) {
                        //console.log(this.id + "left_checkbox_id checked")
                        $("#" + "nanogallery2_container" + checkbox_id.slice(21)).parent().removeClass('border-primary')
                        $("#" + "nanogallery2_container" + checkbox_id.slice(21)).parent().addClass('border-white')
                    }
                    $("#" + checkbox_id).prop('checked', false)
                }
            }
            var history_id_str = ""
            $.each(all_history_index, function (i, history_id_index) {
                history_id_str =  history_id_index + "<-" + history_id_str
            });
            if (history_id_str.length > 0){
                history_id_str = history_id_str.slice(0, -2)
                history_id_str = "<-" + history_id_str
            }
            history_id_str = "(" + current_id_index + ")" + history_id_str
            
            $("#history_id").val(history_id_str);

            $("#confirm_current_label").prop("disabled",false)
        },
        error:function(data){
            console.log("get_video_labelperson_list is wrong");
            //console.log(data)
            console.log(data)
            alert("获取数据出错，请登陆，或联系管理员")
            top.location.reload()
            //loading.stop()
            if (trigger_by_button){
                $("#id_list").val(parseInt($("#id_list").val()) - 1)
            }
            $("#confirm_current_label").prop("disabled",false)

        }
    });
}
function parse_index_from_name(id_name, video_id_str_list) {
    var name_list = id_name.split("|")
    var index_name = ""
    for (var i = 0; i < name_list.length; ++i) {
        index_name  = index_name + video_id_str_list.indexOf(name_list[i]) + "_"
    }
    index_name = index_name.slice(0, -1)
    return index_name
}
function fetch_video_data() {
    $("#scrollContent").scrollTop(0)
    if ($("#camera_list").val().length != 1) {
        alert("请选择一个摄像头")
        return
    }
    $("#seleted_camera").val($("#camera_list").find("option:selected").text());

    // clear global var
    g_video_list_json = []
    g_video_labelman_dict_json = {}
    g_video_id_list = []
    g_current_id_index = 0

    g_last_corrected_id_index = -1
    g_last_corrected_same_id_name_list_json = []

    // ajax get_all_data
    var current_database_name = $("#database_list").find("option:selected").text().slice(4)
    var current_camera_name = $("#camera_list").find("option:selected").text()

    var current_video_name = ""
    var current_labelperson_name = ""
    var trigger_by_button = false

    get_all_data(
        current_database_name,
        current_camera_name,
        current_video_name,
        current_labelperson_name,
        trigger_by_button
    )


    $("#video_list").change(function (e) {
        if (e.originalEvent) {
            console.log("by user $(\"#video_list\").change(function ()" + $(this).val())

            var current_database_name = $("#database_list").find("option:selected").text().slice(4)
            var current_camera_name = $("#camera_list").find("option:selected").text()

            var current_video_name = $("#video_list").find("option:selected").text()
            var current_video_name_idnex = parseInt($("#camera_list").val())
            var current_labelperson_name = ""

            //switch video not save current change
            g_current_id_index = 0

            g_last_corrected_id_index = -1
            g_last_corrected_same_id_name_list_json = []

            var trigger_by_button = false
            get_all_data(
                current_database_name,
                current_camera_name,
                current_video_name,
                current_labelperson_name,
                trigger_by_button,
            )
        }
    })
    $("#label_result_list").change(function (e) {
        if (e.originalEvent) {
            console.log("$(\"#label_result_list\").change(function ()" + $(this).val())

            var current_database_name = $("#database_list").find("option:selected").text().slice(4)
            var current_camera_name = $("#camera_list").find("option:selected").text()

            var current_video_name = $("#video_list").find("option:selected").text()
            var current_labelperson_name = $("#label_result_list").find("option:selected").text()

            //switch video not save current change
            g_current_id_index = 0

            g_last_corrected_id_index = -1
            g_last_corrected_same_id_name_list_json = []

            var trigger_by_button = false
            get_all_data(
                current_database_name,
                current_camera_name,
                current_video_name,
                current_labelperson_name,
                trigger_by_button
            )
        }
    })

    $('#id_list').on('change', function(e){
        //console.log("$('#id_list').on('change', function(){")
        if (e.originalEvent) {
            console.log("$('#id_list').on('change', function(){")
            var trigger_by_button = false


            var current_database_name = $("#database_list").find("option:selected").text().slice(4)
            var current_camera_name = $("#camera_list").find("option:selected").text()

            var current_video_name = $("#video_list").find("option:selected").text()
            var current_labelperson_name = $("#label_result_list").find("option:selected").text()

            get_data_with_index(
                current_database_name,
                current_camera_name,
                current_video_name,
                current_labelperson_name,
                trigger_by_button
            )
            //console.log('$("#scrollContent").scrollTop(0)')
            $("#scrollContent").scrollTop(0)
        }
    })

}
function get_data_with_index(
    current_database_name,
    current_camera_name,
    current_video_name,
    current_labelperson_name,
    trigger_by_button
) {
    console.log("$(\"#id_list\").change(function ()" + $('#id_list').val())

    g_last_corrected_id_index = g_current_id_index
    g_last_corrected_same_id_name_list_json = []

    for (var i = 0; i < 25; ++i) {
        var left_checkbox_id = "nanogallery2_checkbox" + (i * 2)
        var right_checkbox_id = "nanogallery2_checkbox" + (i * 2 + 1)
        if ($("#" + left_checkbox_id).is(':checked') && (i * 2) < g_last_top_50_id_name.length){
            g_last_corrected_same_id_name_list_json.push(g_last_top_50_id_name[(i * 2)])
        }
        if ($("#" + right_checkbox_id).is(':checked') && (i * 2) + 1 < g_last_top_50_id_name.length){
            g_last_corrected_same_id_name_list_json.push(g_last_top_50_id_name[(i * 2 + 1)])
        }
    }

    var current_video_name = $("#video_list").find("option:selected").text()
    var current_video_name_idnex = parseInt($("#camera_list").val())
    var current_labelperson_name = $("#label_result_list").find("option:selected").text()

    g_current_id_index = parseInt($('#id_list').val())
    //$("#seleted_id").val("ID_" +  g_video_id_list_json[g_current_id_index], + "__" + current_video_name);

    get_all_data(
        current_database_name,
        current_camera_name,
        current_video_name,
        current_labelperson_name,
        trigger_by_button
    )
}

function get_next_id_data(){
    //console.log('$("#scrollContent").scrollTop(0)')
    $("#scrollContent").scrollTop(0)
    if (g_video_id_list_json.length == 0){
        console.log("还没有获取列表")
        return
    }

    if (parseInt($("#id_list").val()) == g_video_id_list_json.length - 1 &&
        g_last_corrected_id_index == g_video_id_list_json.length - 1){
        alert("您已标好最后一个ID")
        return
    }

    var current_id_index = parseInt($("#id_list").val())
    console.log("get_next_id_data", $("#id_list").val())
    if (parseInt($("#id_list").val()) == g_video_id_list_json.length - 1) {
        $("#id_list").val(parseInt($("#id_list").val()))
    }else{
        $("#id_list").val(parseInt($("#id_list").val()) + 1)
    }

    var current_database_name = $("#database_list").find("option:selected").text().slice(4)
    var current_camera_name = $("#camera_list").find("option:selected").text()
    var current_video_name = $("#video_list").find("option:selected").text()
    var current_labelperson_name = $("#label_result_list").find("option:selected").text()

    var  trigger_by_button = true
    get_data_with_index(
        current_database_name,
        current_camera_name,
        current_video_name,
        current_labelperson_name,
        trigger_by_button
    )
    console.log("get_next_id_data", $("#id_list").val())

}

function add_search_image(select, src_set, idname, current_video_name, current_id_name, current_id_index, current_mot_id_img_file_name_list) {
    //add_search_image('.selected_image',src_array,"nanogallery0");
    $(select).html('<div id="' + idname + '" style="margin-top: 15px"></div>');
    var items = Array();
    $.each(src_set, function (i, src) {
        items.push({
            src: src,
            srct:src,
            title: "index_" + current_id_index + "_id_name_" + current_id_name + '  '
                 + from_liangjiang_filename_to_localtime(current_mot_id_img_file_name_list[i]),
            description: current_mot_id_img_file_name_list[i],
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
        "thumbnailBorderVertical": 1,
        "thumbnailBorderHorizontal": 1,
        "thumbnailHoverEffect2": "image_scale_1.0_1.1",
        "thumbnailHeight": 190,
        "thumbnailWidth": 110,
        "galleryResizeAnimation ":false,
        /*"thumbnailLabel": {
            "align": "left",
            "position": "onBottom",
            "displayDescription": false,
        },*/
        "galleryMaxRows": 1,
        "thumbnailLabel": {"position": "overImageOnBottom", "hideIcons": true, "display": false},
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

function add_query_result_image(select, src_set, frame_set, score_set, frame_datetime_set, camera_position_set, idname) {
    //add_search_image('#nanogallery2_container',src_array,"nanogallery2");
    $(select).html('<div id="' + idname + '" class="query_result_list"></div>');
    //console.log("add_query_result_image" + "  _  " + idname + "  _  " + select)
    var items = Array();
    $.each(src_set, function (i, src) {
        items.push({
            src: frame_set[i],
            srct: src,
            title: camera_position_set[i],
            description: frame_datetime_set[i],
            customData: {score: score_set[i]}
        })
    });
    jQuery("#" + idname).nanogallery2({
        "colorScheme": {
            "thumbnail": {
                "background": "rgba(255,255,255,1)",
                "borderColor": "rgba(217,237,247,1)"
            }
        },
        "thumbnailAlignment": "center",
        "thumbnailBorderVertical": 1,
        "thumbnailBorderHorizontal": 1,
        "thumbnailHoverEffect2": "image_scale_1.0_1.1",
        "thumbnailHeight": 190,
        "thumbnailWidth": 110,
        "galleryResizeAnimation ":false,
        /*"thumbnailLabel": {
            "align": "left",
            "position": "onBottom",
            "displayDescription": false,
        },*/
        "galleryMaxRows": 1,
        "thumbnailLabel": {"position": "overImageOnBottom", "hideIcons": true, "display": false},
        "galleryDisplayMode": "pagination",
        //"galleryPaginationMode": "numbers",
        //"displayDescription": false,
        "thumbnailGutterWidth": 5,
        "thumbnailOpenImage": true,
        "thumbnailCrop": false,
        "eventsDebounceDelay":10,
        "galleryRenderDelay":10,
        "thumbnailDisplayInterval":1,
        "thumbnailDisplayTransition":"none",
        "thumbnailDisplayTransitionDuration":0,
        "thumbnailDisplayOutsideScreen":true,
        "galleryDisplayTransitionDuration":0,
        "thumbnailWaitImageLoaded":false,
        "thumbnailSliderDelay":0,
        "displayBreadcrumb":false,
        //"thumbnailWaitImageLoaded":false,
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

    // force refresh nanogallery
    $("#scrollContent").scroll(function () {
        var row_estimate = Math.floor($("#scrollContent").scrollTop() / 200)
        //console.log(row_estimate)
       // var gallery_index =
        var safe_show_min = Math.max(2, row_estimate-2) * 2
        var safe_show_max = Math.min(24, row_estimate+2) * 2 + 1
        var min_NUM = NUM - 49 + safe_show_min
        var max_NUM = NUM - 49 + safe_show_max
        for (var i = min_NUM; i <= max_NUM; ++i){
            // if (i == 54){
            //     console.log("#nanogallery2_container_show" + i + "  " + $($($($("#nanogallery2_container_show" + i).children()[2])).children()[0]).children().length)
                if ($($($($("#nanogallery2_container_show" + i).children()[2])).children()[0]).children().length == 0){
                    //$("#nanogallery2_container_show" + i).nanogallery2('paginationPreviousPage')


                    if (g_current_inited_gallery_id_list.indexOf("nanogallery2_container_show" + i) != -1){
                        if (g_current_refreshed_gallery_id_list.indexOf("nanogallery2_container_show" + i) == -1) {
                            //console.log("#nanogallery2_container_show" + i + " trying refresh")

                            $("#nanogallery2_container_show" + i).nanogallery2('refresh')
                            //$("#nanogallery2_container_show" + i).nanogallery2('refresh')
                            //console.log("#nanogallery2_container_show" + i + "refresh")
                            g_current_refreshed_gallery_id_list.push("nanogallery2_container_show" + i)
                        }
                    }

                }

            // }

        }
    })

    //jQuery("#" + idname).nanogallery2("refresh");
    function mylistener(e) {


        if (e.type == "galleryDisplayed"){
            //console.log(this.id, e.type);
            //console.log(this.id);
            if (g_current_inited_gallery_id_list.indexOf(this.id) == -1){
                g_current_inited_gallery_id_list.push(this.id)
                //$(this).nanogallery2('refresh')
                //console.log('refresh');
            }
            var the_index = g_current_refreshed_gallery_id_list.indexOf(this.id)
            if (the_index != -1) {
                g_current_refreshed_gallery_id_list.splice(the_index, 1)
            }
        }

    }
    //if (idname == 'nanogallery2_container_show' + 54) {
        $('#' + idname).on( 'pageChanged.nanogallery2 galleryRenderStart.nanogallery2 galleryRenderEnd.nanogallery2 galleryObjectModelBuilt.nanogallery2 galleryLayoutApplied.nanogallery2 galleryDisplayed.nanogallery2 lightboxNextImage.nanogallery2 lightboxPreviousImage.nanogallery2 lightboxImageDisplayed.nanogallery2 shoppingCartUpdated.nanogallery2 itemSelected.nanogallery2 itemUnSelected.nanogallery2', mylistener );
    //}

}




