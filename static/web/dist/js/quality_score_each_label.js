
function from_line_and_url_to_html(line, url_list) {
    var content = ""
    content += '<div class="row">'
    $.each(url_list, function (i, url) {
        content += '<div><img src="' + url + '"' + ' width="110px" height="190px"' + '></div>';
        // content += '<div><img src="' + url + '"></div>';
    });
    content += '</div>'
    content += '<label>' + line+ '</label>'
    return content;
};

function imageContent(id) {

    // var data = $("<form><ul><li><span aria-hidden='true' class='icon_globe'></span>&nbsp;<font>粉丝数:</font>7389223</li>" +
    //      "<li><span aria-hidden='true' class='icon_piechart'></span>&nbsp;<font>关注:</font>265</li>" +
    //      "<li><span aria-hidden='true' class='icon_search_alt'></span>&nbsp;<font>微博:</font>645</li>" +
    //      "<li><span aria-hidden='true' class='icon_pens_alt'></span>&nbsp;<font>所在地:</font>台湾</li>" +
    //      "</form>");
    //
    // return data;

    var content = "<div>";
    switch (id) {
        case "is_real_man_help":
            var line = "各种明显的雕塑、图片、人偶都属于非人。（1）"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image001.gif",
                "/static/web/dist/img/quality_score_img/image002.gif",
                "/static/web/dist/img/quality_score_img/image003.gif",
                "/static/web/dist/img/quality_score_img/image004.gif",
                "/static/web/dist/img/quality_score_img/image005.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "真人海报，照片、视频中的人算人体。（0）"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image006.gif",
                "/static/web/dist/img/quality_score_img/image007.gif",
                "/static/web/dist/img/quality_score_img/image008.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break;
        case "has_vehicle_help":
            var line = "自行车、电动车都算，婴儿车也算。"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image009.gif",
                "/static/web/dist/img/quality_score_img/image010.gif",
                "/static/web/dist/img/quality_score_img/image011.gif",
                "/static/web/dist/img/quality_score_img/image012.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break;
        case "has_print_help":
            var line = "除了左1是不含打印字，其他都是含有打印字的"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image013.gif",
                "/static/web/dist/img/quality_score_img/image014.gif",
                "/static/web/dist/img/quality_score_img/image015.gif",
                "/static/web/dist/img/quality_score_img/image016.gif",
                "/static/web/dist/img/quality_score_img/image017.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break;
        case "is_multi_person_help":
            var line = "左边2个是画面中有两个完整的人体；中间2个是框位置不准，容纳了太多其他人的区域；"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image018.gif",
                "/static/web/dist/img/quality_score_img/image019.gif",
                "/static/web/dist/img/quality_score_img/image020.gif",
                "/static/web/dist/img/quality_score_img/image021.gif",
                "/static/web/dist/img/quality_score_img/image022.gif",
                "/static/web/dist/img/quality_score_img/image023.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "右边两个是框的后面的人，但是前面的人有大面积的遮挡（30%以上都算）。"
            content += from_line_and_url_to_html(line, [])
            break;
        case "crop_level_help":
            var line = "几乎没有截断"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image024.gif",
                "/static/web/dist/img/quality_score_img/image025.gif",
                "/static/web/dist/img/quality_score_img/image026.gif",
                "/static/web/dist/img/quality_score_img/image027.gif",
                "/static/web/dist/img/quality_score_img/image028.gif",
                "/static/web/dist/img/quality_score_img/image029.gif",
                "/static/web/dist/img/quality_score_img/image030.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "5%~20%（四肢头部有少量的截断、较为完整）"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image031.gif",
                "/static/web/dist/img/quality_score_img/image032.gif",
                "/static/web/dist/img/quality_score_img/image033.gif",
                "/static/web/dist/img/quality_score_img/image034.gif",
                "/static/web/dist/img/quality_score_img/image035.gif",
                "/static/web/dist/img/quality_score_img/image036.gif",
                "/static/web/dist/img/quality_score_img/image037.gif",
                "/static/web/dist/img/quality_score_img/image038.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "20~45%（四肢头部有较多的截断）"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image039.gif",
                "/static/web/dist/img/quality_score_img/image040.gif",
                "/static/web/dist/img/quality_score_img/image041.gif",
                "/static/web/dist/img/quality_score_img/image042.gif",
                "/static/web/dist/img/quality_score_img/image043.gif",
                "/static/web/dist/img/quality_score_img/image044.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "45%以上（有较大部分的截断）"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image045.gif",
                "/static/web/dist/img/quality_score_img/image046.gif",
                "/static/web/dist/img/quality_score_img/image047.gif",
                "/static/web/dist/img/quality_score_img/image048.gif",
                "/static/web/dist/img/quality_score_img/image049.gif",
                "/static/web/dist/img/quality_score_img/image050.gif",
                "/static/web/dist/img/quality_score_img/image051.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break;
        case "crop_bad_border_level_help":
            var line = "0~5%（几乎没有包括多余的，最左提的袋子属于人）"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image052.gif",
                "/static/web/dist/img/quality_score_img/image053.gif",
                "/static/web/dist/img/quality_score_img/image054.gif",
                "/static/web/dist/img/quality_score_img/image0545.gif",
                "/static/web/dist/img/quality_score_img/image055.gif",
                "/static/web/dist/img/quality_score_img/image056.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "5%~20%（存在明显能感知到的多余区域、但区域并不大）"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image057.gif",
                "/static/web/dist/img/quality_score_img/image058.gif",
                "/static/web/dist/img/quality_score_img/image059.gif",
                "/static/web/dist/img/quality_score_img/image060.gif",
                "/static/web/dist/img/quality_score_img/image061.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "20%以上（非人区域过多）"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image062.gif",
                "/static/web/dist/img/quality_score_img/image063.gif",
                "/static/web/dist/img/quality_score_img/image064.gif",
                "/static/web/dist/img/quality_score_img/image065.gif",
                "/static/web/dist/img/quality_score_img/image066.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)

            break;
        case "occlusion_level_help":
            var line = "左边1、2、3为0~5%(几乎没有遮挡)，右边4、5、6为5%~20%（四肢头部有少量的遮挡、较为完整）"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image077.gif",
                "/static/web/dist/img/quality_score_img/image078.gif",
                "/static/web/dist/img/quality_score_img/image079.gif",
                "/static/web/dist/img/quality_score_img/image080.gif",
                "/static/web/dist/img/quality_score_img/image081.gif",
                "/static/web/dist/img/quality_score_img/image082.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "左边1、2、3、4为20~45%（四肢头部有较多的遮挡），右边5、6、7为45%以上（有较大部分的遮挡）"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image083.gif",
                "/static/web/dist/img/quality_score_img/image084.gif",
                "/static/web/dist/img/quality_score_img/image085.gif",
                "/static/web/dist/img/quality_score_img/image086.gif",
                "/static/web/dist/img/quality_score_img/image087.gif",
                "/static/web/dist/img/quality_score_img/image088.gif",
                "/static/web/dist/img/quality_score_img/image089.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break
        case "blur_level_help":
            var line = "从左到右逐渐模糊，左边1、2、3为0（清晰），4、5为1（有一定的模糊）"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image090.gif",
                "/static/web/dist/img/quality_score_img/image091.gif",
                "/static/web/dist/img/quality_score_img/image092.gif",
                "/static/web/dist/img/quality_score_img/image093.gif",
                "/static/web/dist/img/quality_score_img/image094.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "从左到右逐渐模糊，都属于2。其中最右边是因为图片解码产生的问题。"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image095.gif",
                "/static/web/dist/img/quality_score_img/image096.gif",
                "/static/web/dist/img/quality_score_img/image097.gif",
                "/static/web/dist/img/quality_score_img/image098.gif",
                "/static/web/dist/img/quality_score_img/image099.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break
        case "brightness_level_help":
            var line = "亮度为0（亮度适中）的示例，亮度和模糊度的标注互不影响。"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image100.gif",
                "/static/web/dist/img/quality_score_img/image101.gif",
                "/static/web/dist/img/quality_score_img/image102.gif",
                "/static/web/dist/img/quality_score_img/image103.gif",
                "/static/web/dist/img/quality_score_img/image104.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "亮度较差（1）的例子，包含身上明显的亮暗差，偏色灯光，。"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image105.gif",
                "/static/web/dist/img/quality_score_img/image106.gif",
                "/static/web/dist/img/quality_score_img/image107.gif",
                "/static/web/dist/img/quality_score_img/image108.gif",
                "/static/web/dist/img/quality_score_img/image109.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "亮度极差（2）的例子"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image110.gif",
                "/static/web/dist/img/quality_score_img/image111.gif",
                "/static/web/dist/img/quality_score_img/image112.gif",
                "/static/web/dist/img/quality_score_img/image113.gif",
                "/static/web/dist/img/quality_score_img/image114.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break
        case "pose_level_help":
            var line = "1、2正常行走姿态（0）；3介于合格不合格之间的一定角度弯腰（1）；"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image115.gif",
                "/static/web/dist/img/quality_score_img/image116.gif",
                "/static/web/dist/img/quality_score_img/image117.gif",
                "/static/web/dist/img/quality_score_img/image118.gif",
                "/static/web/dist/img/quality_score_img/image119.gif",
                "/static/web/dist/img/quality_score_img/image120.gif",
                "/static/web/dist/img/quality_score_img/image121.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "4、5、6、7大幅度的蹲下、弯腰、坐姿以及复杂动作（2）"
            content += from_line_and_url_to_html(line, [])
            break
        case "contrast_level_help":
            var line = "辨识度正常的装扮（0）"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image122.gif",
                "/static/web/dist/img/quality_score_img/image123.gif",
                "/static/web/dist/img/quality_score_img/image124.gif",
                "/static/web/dist/img/quality_score_img/image125.gif",
                "/static/web/dist/img/quality_score_img/image126.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "装扮有大量的纯色，装扮较为常见。但还有一些可供分辨的小装饰等等。"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image127.gif",
                "/static/web/dist/img/quality_score_img/image128.gif",
                "/static/web/dist/img/quality_score_img/image129.gif",
                "/static/web/dist/img/quality_score_img/image130.gif",
                "/static/web/dist/img/quality_score_img/image131.gif",
                "/static/web/dist/img/quality_score_img/image132.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line = "严重影响再识别的图片（2）"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image133.gif",
                "/static/web/dist/img/quality_score_img/image134.gif",
                "/static/web/dist/img/quality_score_img/image135.gif",
                "/static/web/dist/img/quality_score_img/image136.gif",
                "/static/web/dist/img/quality_score_img/image137.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break
        case "is_after_glass_help":
            var line = "1为在透明物体后的人，2、3是玻璃镜面中的人。"

            var line_url = [
                "/static/web/dist/img/quality_score_img/image138.gif",
                "/static/web/dist/img/quality_score_img/image139.gif",
                "/static/web/dist/img/quality_score_img/image140.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break
        case "card-footer_help":

            content += '<H5>' + '标注顺序上:'+ '</H5>'
            content += '<label>' + '1）首先对是否非机动车、是否真人、是否含有打印文字、是否多人这几个比较简单的标注。'+ '</label>'
            content += '<div class="row"></div>'
            content += '<label>' + '同时这几个标注的特点就是一旦不符合要求，质量一定为“差”。'+ '</label>'
            content += '<H6>' + '后续就不用标了。（除非这个图片严重截断（45%）这样要把截断标了，严重截断的后面也不用标注了）'+ '</H6>'
            content += '<div class="row"></div>'
            content += '<label>' + '2）其次对截断和遮挡进行标注：这部分的是最为常见的影响质量的因素，对应的如果有大面'+ '</label>'
            content += '<div class="row"></div>'
            content += '<label>' + '积的截断和遮挡，则为“差”。'+ '</label>'
            content += '<div class="row"></div>'
            content += '<label>' + '3）最后标注模糊度、亮度、姿态、是否在透明物体后或在镜子中、装扮辨识度，相对难以'+ '</label>'
            content += '<div class="row"></div>'
            content += '<label>' + '标注或者有问题的少。'+ '</label>'
            content += '<H5>' + '其他:'+ '</H5>'
            var line = "手提包定义为人的一部人，但是类似1、2、3无论是框起来或者没框都是合理的。"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image067.gif",
                "/static/web/dist/img/quality_score_img/image068.gif",
                "/static/web/dist/img/quality_score_img/image069.gif",
                "/static/web/dist/img/quality_score_img/image070.gif",
                "/static/web/dist/img/quality_score_img/image071.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            var line =  "行李箱等需要拖的或者是雨伞都不视为人的组成部分，所以4、5的框都是比较合理的。"
            content += from_line_and_url_to_html(line, [])
            var line = "左边1、2两张对应就是行李箱和雨伞干扰了人边界的定义，但是相对程度不严重。3、4、5则属于引入了过多非人区域。"
            var line_url = [
                "/static/web/dist/img/quality_score_img/image072.gif",
                "/static/web/dist/img/quality_score_img/image073.gif",
                "/static/web/dist/img/quality_score_img/image074.gif",
                "/static/web/dist/img/quality_score_img/image075.gif",
                "/static/web/dist/img/quality_score_img/image076.gif",
            ]
            content += from_line_and_url_to_html(line, line_url)
            break
    }
    content += "</div>";
    var data = $(content);

    return data;
};


// init
g_database_list_json = []
g_database_batch_dict_json = {}
$(function () {

    // $("#is_real_man_help").popover({
    //     html : true,
    //     content: function() {
    //         return imageContent(this.id);
    //     }
    // });
    $("[data-toggle='popover']").popover({
        html : true,
        delay:{show:500, hide:1000},
        container: 'body',
        content: function() {
          return imageContent(this.id);
        }
    });



    // using ajax to get database and camera list
    var dataurl = '/quality_get_database_batch_list/';
    $.ajax({
        url: dataurl,
        type: "GET",
        success: function (data) {
            var json_data = JSON.parse(data)

            $.each(json_data['database_list'], function (i, database_name) {
                g_database_list_json.push(database_name);
                g_database_batch_dict_json[database_name] = json_data['database_batch_list'][i]
            });

            $.each(g_database_list_json, function (i, database_name) {
                $("#database_list").append("<option value=" + i + ">数据源：" + database_name + "</option>");
                if (i == 0) {
                    $("#database_list").val(i);
                }
            });
            if (g_database_list_json.length > 0) {
                $.each(g_database_batch_dict_json[g_database_list_json[0]], function (i, batch_name) {
                    $("#batch_list").append("<option value=" + i + ">" + batch_name + "</option>");
                });
            }

        },
        error: function (data) {
            console.log("get_database_batch_list is wrong");
            //console.log(data)
            console.log(data)
            alert("获取数据库和标注批次列表出错，请登陆，或联系管理员")
            //loading.stop()
        }
    });

    // logic for database change
    $("#database_list").change(function () {
        $("#batch_list").empty()
        $.each(g_database_batch_dict_json[g_database_list_json[parseInt($("#database_list").val())]], function (i, batch_name) {
            $("#batch_list").append("<option value=" + i + ">" + batch_name + "</option>");
        });
        $("#seleted_batch").val("当前标注对象序号范围");
        //TODO: add logic to clear all gallery
    })

});

NUM = 5;
//TODO: might reduce global var
g_current_id_index = 0
g_last_label_id_index = -1
g_last_label_result_dict_json = {}
g_batch_name_list = []
function get_all_data(
    current_database_name,
    current_batch_name,
    current_labelperson_name
) {
    var dataurl='/quality_get_all_data/';

    // using button disable prop as mutex
    if ($("#confirm_current_label").prop("disabled") == true){
        return
    }
    $("#confirm_current_label").prop("disabled",true)

    var data=JSON.stringify({
        current_database_name:current_database_name,
        current_batch_name:current_batch_name,
        current_labelperson_name:current_labelperson_name,
        current_id_index:g_current_id_index,
        last_label_id_index:g_last_label_id_index,
        last_label_result_dict_json:g_last_label_result_dict_json,
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

            var labelperson_list = json_data['labelperson_list']

            var batch_id_name_list = json_data['batch_id_name_list']

            var current_id_img_url = json_data['current_id_img_url']

            var current_id_index  = json_data['current_id_index_for_front']

            var all_history_index  = json_data['all_history_index_for_front']

            var possible_confict = json_data['possible_confict']

            var current_id_label_result_dict = json_data['current_id_label_result_dict']

            if (current_labelperson_name == ""){
                $("#label_result_list").empty()

                $.each(labelperson_list, function (i, laberperson_name){
                    $("#label_result_list").append("<option value=" + i + ">" + laberperson_name + "</option>");
                });
                current_labelperson_name = $("#label_result_list").find("option:selected").text()
            }
            //console.log($("#label_result_list").find("option:selected").text())

            if (g_last_label_id_index == -1 || g_current_id_index == 0){
                $("#id_list").empty()
                g_batch_name_list = batch_id_name_list
                $.each(batch_id_name_list, function (i, id_name) {
                    $("#id_list").append("<option value=" + i + ">" + i + "/" + (batch_id_name_list.length-1) + "</option>");
                });
            }
            g_current_id_index = current_id_index
            $("#id_list").val(g_current_id_index);
            $("#seleted_id").val("ID_" + batch_id_name_list[g_current_id_index]);

            add_image('.selected_image', [current_id_img_url], "nanogallery_one" + NUM,
                                batch_id_name_list[g_current_id_index], g_current_id_index)
            NUM = NUM + 1


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

            //set label result
            //dict is full always
            // step 1
            if (current_id_label_result_dict["is_real_man"] >= 0) {
                if (current_id_label_result_dict["is_real_man"] == 0) {
                    $("input[type='radio'][name='is_real_man']").get(0).checked = true
                }else if (current_id_label_result_dict["is_real_man"] == 1){
                    $("input[type='radio'][name='is_real_man']").get(1).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='is_real_man']").get(0).checked = false
                $("input[type='radio'][name='is_real_man']").get(1).checked = false
            }

            if (current_id_label_result_dict["has_vehicle"] >= 0) {
                if (current_id_label_result_dict["has_vehicle"] == 0) {
                    $("input[type='radio'][name='has_vehicle']").get(0).checked = true
                }else if (current_id_label_result_dict["has_vehicle"] == 1){
                    $("input[type='radio'][name='has_vehicle']").get(1).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='has_vehicle']").get(0).checked = false
                $("input[type='radio'][name='has_vehicle']").get(1).checked = false
            }

            if (current_id_label_result_dict["has_print"] >= 0) {
                if (current_id_label_result_dict["has_print"] == 0) {
                    $("input[type='radio'][name='has_print']").get(0).checked = true
                }else if (current_id_label_result_dict["has_print"] == 1){
                    $("input[type='radio'][name='has_print']").get(1).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='has_print']").get(0).checked = false
                $("input[type='radio'][name='has_print']").get(1).checked = false
            }

            if (current_id_label_result_dict["is_multi_person"] >= 0) {
                if (current_id_label_result_dict["is_multi_person"] == 0) {
                    $("input[type='radio'][name='is_multi_person']").get(0).checked = true
                }else if (current_id_label_result_dict["is_multi_person"] == 1){
                    $("input[type='radio'][name='is_multi_person']").get(1).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='is_multi_person']").get(0).checked = false
                $("input[type='radio'][name='is_multi_person']").get(1).checked = false
            }

            //step 2
            if (current_id_label_result_dict["crop_level"] >= 0) {
                if (current_id_label_result_dict["crop_level"] == 0) {
                    $("input[type='radio'][name='crop_level']").get(0).checked = true
                }else if (current_id_label_result_dict["crop_level"] == 1){
                    $("input[type='radio'][name='crop_level']").get(1).checked = true
                }else if (current_id_label_result_dict["crop_level"] == 2){
                    $("input[type='radio'][name='crop_level']").get(2).checked = true
                }else if (current_id_label_result_dict["crop_level"] == 3){
                    $("input[type='radio'][name='crop_level']").get(3).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='crop_level']").get(0).checked = false
                $("input[type='radio'][name='crop_level']").get(1).checked = false
                $("input[type='radio'][name='crop_level']").get(2).checked = false
                $("input[type='radio'][name='crop_level']").get(3).checked = false
            }

            if (current_id_label_result_dict["crop_bad_border_level"] >= 0) {
                if (current_id_label_result_dict["crop_bad_border_level"] == 0) {
                    $("input[type='radio'][name='crop_bad_border_level']").get(0).checked = true
                }else if (current_id_label_result_dict["crop_bad_border_level"] == 1){
                    $("input[type='radio'][name='crop_bad_border_level']").get(1).checked = true
                }else if (current_id_label_result_dict["crop_bad_border_level"] == 2){
                    $("input[type='radio'][name='crop_bad_border_level']").get(2).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='crop_bad_border_level']").get(0).checked = false
                $("input[type='radio'][name='crop_bad_border_level']").get(1).checked = false
                $("input[type='radio'][name='crop_bad_border_level']").get(2).checked = false
            }

            if (current_id_label_result_dict["occlusion_level"] >= 0) {
                if (current_id_label_result_dict["occlusion_level"] == 0) {
                    $("input[type='radio'][name='occlusion_level']").get(0).checked = true
                }else if (current_id_label_result_dict["occlusion_level"] == 1){
                    $("input[type='radio'][name='occlusion_level']").get(1).checked = true
                }else if (current_id_label_result_dict["occlusion_level"] == 2){
                    $("input[type='radio'][name='occlusion_level']").get(2).checked = true
                }else if (current_id_label_result_dict["occlusion_level"] == 3){
                    $("input[type='radio'][name='occlusion_level']").get(3).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='occlusion_level']").get(0).checked = false
                $("input[type='radio'][name='occlusion_level']").get(1).checked = false
                $("input[type='radio'][name='occlusion_level']").get(2).checked = false
                $("input[type='radio'][name='occlusion_level']").get(3).checked = false
            }

            //step 3
            if (current_id_label_result_dict["blur_level"] >= 0) {
                if (current_id_label_result_dict["blur_level"] == 0) {
                    $("input[type='radio'][name='blur_level']").get(0).checked = true
                }else if (current_id_label_result_dict["blur_level"] == 1){
                    $("input[type='radio'][name='blur_level']").get(1).checked = true
                }else if (current_id_label_result_dict["blur_level"] == 2){
                    $("input[type='radio'][name='blur_level']").get(2).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='blur_level']").get(0).checked = false
                $("input[type='radio'][name='blur_level']").get(1).checked = false
                $("input[type='radio'][name='blur_level']").get(2).checked = false
            }

            if (current_id_label_result_dict["brightness_level"] >= 0) {
                if (current_id_label_result_dict["brightness_level"] == 0) {
                    $("input[type='radio'][name='brightness_level']").get(0).checked = true
                }else if (current_id_label_result_dict["brightness_level"] == 1){
                    $("input[type='radio'][name='brightness_level']").get(1).checked = true
                }else if (current_id_label_result_dict["brightness_level"] == 2){
                    $("input[type='radio'][name='brightness_level']").get(2).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='brightness_level']").get(0).checked = false
                $("input[type='radio'][name='brightness_level']").get(1).checked = false
                $("input[type='radio'][name='brightness_level']").get(2).checked = false
            }

            if (current_id_label_result_dict["pose_level"] >= 0) {
                if (current_id_label_result_dict["pose_level"] == 0) {
                    $("input[type='radio'][name='pose_level']").get(0).checked = true
                }else if (current_id_label_result_dict["pose_level"] == 1){
                    $("input[type='radio'][name='pose_level']").get(1).checked = true
                }else if (current_id_label_result_dict["pose_level"] == 2){
                    $("input[type='radio'][name='pose_level']").get(2).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='pose_level']").get(0).checked = false
                $("input[type='radio'][name='pose_level']").get(1).checked = false
                $("input[type='radio'][name='pose_level']").get(2).checked = false
            }

            if (current_id_label_result_dict["contrast_level"] >= 0) {
                if (current_id_label_result_dict["contrast_level"] == 0) {
                    $("input[type='radio'][name='contrast_level']").get(0).checked = true
                }else if (current_id_label_result_dict["contrast_level"] == 1){
                    $("input[type='radio'][name='contrast_level']").get(1).checked = true
                }else if (current_id_label_result_dict["contrast_level"] == 2){
                    $("input[type='radio'][name='contrast_level']").get(2).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='contrast_level']").get(0).checked = false
                $("input[type='radio'][name='contrast_level']").get(1).checked = false
                $("input[type='radio'][name='contrast_level']").get(2).checked = false
            }

            if (current_id_label_result_dict["is_after_glass"] >= 0) {
                if (current_id_label_result_dict["is_after_glass"] == 0) {
                    $("input[type='radio'][name='is_after_glass']").get(0).checked = true
                }else if (current_id_label_result_dict["is_after_glass"] == 1){
                    $("input[type='radio'][name='is_after_glass']").get(1).checked = true
                }else{
                    alert("获取后端数据出错，请联系管理员")
                    top.location.reload()
                }
            }else{
                $("input[type='radio'][name='is_after_glass']").get(0).checked = false
                $("input[type='radio'][name='is_after_glass']").get(1).checked = false
            }

            if (possible_confict) {
                alert("标注存在冲突，请再次确认当前标注结果")
            }
        },
        error:function(data){
            console.log("get_video_labelperson_list is wrong");
            //console.log(data)
            console.log(data)
            alert("获取数据出错，请登陆，或联系管理员")
            top.location.reload()
        }
    });
}

function get_data_with_index(
    current_database_name,
    current_batch_name,
    current_labelperson_name
) {
    console.log("$(\"#id_list\").change(function ()" + $('#id_list').val())

    g_last_label_id_index = g_current_id_index
    g_last_label_result_dict_json = {}

    // var label_item_list = [
    //     "is_real_man",
    //     "has_vehicle",
    //     "has_print",
    //     "is_multi_person",
    //     "crop_level",
    //     "crop_bad_border_level",
    //     "occlusion_level",
    //     "blur_level",
    //     "brightness_level",
    //     "pose_level",
    //     "contrast_level",
    //     "is_after_glass"
    // ]

    // step one
    if ($('input[type="radio"][name="is_real_man"]:checked').val() == null){
        g_last_label_result_dict_json["is_real_man"] = -1
    }else{
        g_last_label_result_dict_json["is_real_man"] = parseInt($('input[type="radio"][name="is_real_man"]:checked').val())
    }

    if ($('input[type="radio"][name="has_vehicle"]:checked').val() == null){
        g_last_label_result_dict_json["has_vehicle"] = -1
    }else{
        g_last_label_result_dict_json["has_vehicle"] = parseInt($('input[type="radio"][name="has_vehicle"]:checked').val())
    }

    if ($('input[type="radio"][name="has_print"]:checked').val() == null){
        g_last_label_result_dict_json["has_print"] = -1
    }else{
        g_last_label_result_dict_json["has_print"] = parseInt($('input[type="radio"][name="has_print"]:checked').val())
    }

    if ($('input[type="radio"][name="is_multi_person"]:checked').val() == null){
        g_last_label_result_dict_json["is_multi_person"] = -1
    }else{
        g_last_label_result_dict_json["is_multi_person"] = parseInt($('input[type="radio"][name="is_multi_person"]:checked').val())
    }

    //step two
    if ($('input[type="radio"][name="crop_level"]:checked').val() == null){
        g_last_label_result_dict_json["crop_level"] = -1
    }else{
        g_last_label_result_dict_json["crop_level"] = parseInt($('input[type="radio"][name="crop_level"]:checked').val())
    }

    if ($('input[type="radio"][name="crop_bad_border_level"]:checked').val() == null){
        g_last_label_result_dict_json["crop_bad_border_level"] = -1
    }else{
        g_last_label_result_dict_json["crop_bad_border_level"] = parseInt($('input[type="radio"][name="crop_bad_border_level"]:checked').val())
    }

    if ($('input[type="radio"][name="occlusion_level"]:checked').val() == null){
        g_last_label_result_dict_json["occlusion_level"] = -1
    }else{
        g_last_label_result_dict_json["occlusion_level"] = parseInt($('input[type="radio"][name="occlusion_level"]:checked').val())
    }

    //step three
    if ($('input[type="radio"][name="blur_level"]:checked').val() == null){
        g_last_label_result_dict_json["blur_level"] = -1
    }else{
        g_last_label_result_dict_json["blur_level"] = parseInt($('input[type="radio"][name="blur_level"]:checked').val())
    }

    if ($('input[type="radio"][name="brightness_level"]:checked').val() == null){
        g_last_label_result_dict_json["brightness_level"] = -1
    }else{
        g_last_label_result_dict_json["brightness_level"] = parseInt($('input[type="radio"][name="brightness_level"]:checked').val())
    }

    if ($('input[type="radio"][name="pose_level"]:checked').val() == null){
        g_last_label_result_dict_json["pose_level"] = -1
    }else{
        g_last_label_result_dict_json["pose_level"] = parseInt($('input[type="radio"][name="pose_level"]:checked').val())
    }

    if ($('input[type="radio"][name="contrast_level"]:checked').val() == null){
        g_last_label_result_dict_json["contrast_level"] = -1
    }else{
        g_last_label_result_dict_json["contrast_level"] = parseInt($('input[type="radio"][name="contrast_level"]:checked').val())
    }

    if ($('input[type="radio"][name="is_after_glass"]:checked').val() == null){
        g_last_label_result_dict_json["is_after_glass"] = -1
    }else{
        g_last_label_result_dict_json["is_after_glass"] = parseInt($('input[type="radio"][name="is_after_glass"]:checked').val())
    }

    var result_is_valid = false
    if (
        $('input[type="radio"][name="is_real_man"]:checked').val() == null ||
        $('input[type="radio"][name="has_vehicle"]:checked').val() == null ||
        $('input[type="radio"][name="has_print"]:checked').val() == null ||
        $('input[type="radio"][name="is_multi_person"]:checked').val() == null
    ){
        result_is_valid = false
    }else{
        if (
            parseInt($('input[type="radio"][name="is_real_man"]:checked').val()) > 0 ||
            parseInt($('input[type="radio"][name="has_vehicle"]:checked').val()) > 0 ||
            parseInt($('input[type="radio"][name="has_print"]:checked').val()) > 0 ||
            parseInt($('input[type="radio"][name="is_multi_person"]:checked').val()) > 0
        ){
            result_is_valid = true
        }else{
            if ($('input[type="radio"][name="crop_level"]:checked').val() == 3){
                result_is_valid = true
            }else if (
                $('input[type="radio"][name="crop_level"]:checked').val() == null ||
                $('input[type="radio"][name="crop_bad_border_level"]:checked').val() == null ||
                $('input[type="radio"][name="occlusion_level"]:checked').val() == null ||

                $('input[type="radio"][name="blur_level"]:checked').val() == null ||
                $('input[type="radio"][name="brightness_level"]:checked').val() == null ||
                $('input[type="radio"][name="pose_level"]:checked').val() == null ||
                $('input[type="radio"][name="contrast_level"]:checked').val() == null ||
                $('input[type="radio"][name="is_after_glass"]:checked').val() == null
            ){
                result_is_valid = false
            }else{
                result_is_valid = true
            }
        }
    }

    if (result_is_valid == false){
        $("#id_list").val(g_last_label_id_index);
        alert("标注未完成，请检查")
        return
    }

    g_current_id_index = parseInt($('#id_list').val())

    get_all_data(
        current_database_name,
        current_batch_name,
        current_labelperson_name
    )
}

function get_next_id_data(){

    if (g_batch_name_list.length == 0){
        console.log("还没有获取列表")
        return
    }

    if (parseInt($("#id_list").val()) == g_batch_name_list.length - 1 &&
        g_last_label_id_index == g_batch_name_list.length - 1){
        alert("您已标好最后一个ID")
        return
    }

    // console.log("get_next_id_data", $("#id_list").val())
    if (parseInt($("#id_list").val()) == g_batch_name_list.length - 1) {
        $("#id_list").val(parseInt($("#id_list").val()))
    }else{
        $("#id_list").val(parseInt($("#id_list").val()) + 1)
    }

    var current_database_name = $("#database_list").find("option:selected").text().slice(4)
    var current_batch_name = $("#batch_list").find("option:selected").text()
    var current_labelperson_name = $("#label_result_list").find("option:selected").text()

    get_data_with_index(
        current_database_name,
        current_batch_name,
        current_labelperson_name
    )
    // console.log("get_next_id_data", $("#id_list").val())
}

function fetch_batch_data(){
    if ($("#batch_list").val().length != 1) {
        alert("请选择一个序号范围")
        return
    }
    $("#seleted_batch").val($("#batch_list").find("option:selected").text());

    // clear global var
    g_current_id_index = 0

    g_last_label_id_index = -1
    g_last_label_result_dict_json = {}
    g_batch_name_list = []

    // ajax get_all_data
    var current_database_name = $("#database_list").find("option:selected").text().slice(4)
    var current_batch_name = $("#batch_list").find("option:selected").text()

    var current_labelperson_name = ""

    get_all_data(
        current_database_name,
        current_batch_name,
        current_labelperson_name
    )

    $("#label_result_list").change(function (e) {
        if (e.originalEvent) {
            console.log("$(\"#label_result_list\").change(function ()" + $(this).val())

            var current_database_name = $("#database_list").find("option:selected").text().slice(4)
            var current_batch_name = $("#batch_list").find("option:selected").text()
            var current_labelperson_name = $("#label_result_list").find("option:selected").text()

            //switch label_result not save current change
            g_current_id_index = 0

            g_last_label_id_index = -1
            g_last_label_result_dict_json = {}
            g_batch_name_list = []

            get_all_data(
                current_database_name,
                current_batch_name,
                current_labelperson_name
            )
            // $("#scrollContent").scrollTop(0)
        }
    })

    $('#id_list').on('change', function(e){
        //console.log("$('#id_list').on('change', function(){")
        if (e.originalEvent) {
            console.log("$('#id_list').on('change', function(){")

            var current_database_name = $("#database_list").find("option:selected").text().slice(4)
            var current_batch_name = $("#batch_list").find("option:selected").text()
            var current_labelperson_name = $("#label_result_list").find("option:selected").text()

            get_data_with_index(
                current_database_name,
                current_batch_name,
                current_labelperson_name
            )
            //console.log('$("#scrollContent").scrollTop(0)')
            // $("#scrollContent").scrollTop(0)
        }
    })
}

function step_one_clear()
{
    $("input[type='radio'][name='is_real_man']").get(0).checked = true
    $("input[type='radio'][name='has_vehicle']").get(0).checked = true
    $("input[type='radio'][name='has_print']").get(0).checked = true
    $("input[type='radio'][name='is_multi_person']").get(0).checked = true
}
function step_three_clear()
{
    $("input[type='radio'][name='blur_level']").get(0).checked = true
    $("input[type='radio'][name='brightness_level']").get(0).checked = true
    $("input[type='radio'][name='pose_level']").get(0).checked = true
    $("input[type='radio'][name='contrast_level']").get(0).checked = true
    $("input[type='radio'][name='is_after_glass']").get(0).checked = true
}

function add_image(select, src_set, idname, current_id_name, current_id_index) {
    //add_search_image('.selected_image',src_array,"nanogallery0");
    $(select).html('<div id="' + idname + '" style="margin-top: 15px"></div>');
    var items = Array();
    $.each(src_set, function (i, src) {
        items.push({
            src: src,
            srct:src,
            // title: "index_" + (current_id_index + g_id_range_start_and_end[0]),
            // description: "_id_name_" + current_id_name,
            title: "index_" + current_id_index + "_id_name_" + current_id_name,
            description: "",
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
        "thumbnailHeight": 384,
        "thumbnailWidth": 128,
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