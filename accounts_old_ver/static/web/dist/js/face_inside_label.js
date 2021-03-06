// 人脸类内清理前端
g_database_list_json = [];
g_user_labeled_id = [];
g_current_main_imgs = [];//主类图片列表
g_current_sec_imgs = [];//次类图片列表
g_current_id_index = 0;
g_ischecker = false;
sec_pic_index = 0;// 当前top图片的索引
bad_num = 0; //记录未选中的图片数量，超过3就提示结束

$(function () {
    // using ajax to get database and camera list
    var dataurl = '/face_inside_get_database_id_range_list/';
    $.ajax({
        url: dataurl,
        type: "GET",
        success: function (data) {
            var json_data = JSON.parse(data);
            console.log(json_data);
            // 获取数据库列表
            $.each(json_data['database_list'], function (i, database_name) {
                g_database_list_json.push(database_name);
            });

            $.each(g_database_list_json, function (i, database_name) {
                $("#database_list").append("<option value=" + i + ">数据源：" + database_name + "</option>");
                $("#database_list").val("");
            });

        },
        error: function (data) {
            alert(data.responseJSON["msg"]);
        }
    });
    // logic for database change
    $('#database_list').on('change', function(e){
        if (e.originalEvent) {
            var current_database_name = $("#database_list").find("option:selected").text().slice(4);
            get_id_range(current_database_name);
            //console.log('$("#scrollContent").scrollTop(0)')
            $("#scrollContent").scrollTop(0)
        }
    });

    // 按键事件
    $(document).keyup(function (event) {
        switch(event.keyCode) {
            case 68: // "d"
                if(g_current_id_index < g_user_labeled_id.length - 1 || g_ischecker || g_current_sec_imgs.length < 2)
                    get_next_id_data();
                else
                    alert("抱歉，您只能浏览您标注过的图片！");
                return;
            case 65:
                get_back_id();
                return;
        }
    })
});

function get_id_range(current_database_name)
{
    var dataurl='/face_inside_get_id_range/';
    var data=JSON.stringify({
        current_database_name:current_database_name,//当前的数据库名称
    });
    jQuery(document).ajaxSend(function(event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        // console.log(cookieValue);
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
    });//发送cookie，验证登录

    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            //每次加载时重置一些参数
            var json_data=JSON.parse(data);
            //console.log(json_data);
            var current_id_range = json_data['current_id_range']; // 当前标注人的标注范围
            var user_labeled_id = json_data['user_labeled_id'];
            var current_labeler_last_index = user_labeled_id.length - 1;// 当前标注人最后标注的位置 ，即当前主类图片序列
            var labeler = json_data['labeler'];
            if(labeler.indexOf("check") > -1)
            {
                g_ischecker = true;
            }
            g_user_labeled_id = user_labeled_id;
            g_current_id_index = current_labeler_last_index;

            $('#seleted_id_range').val(current_id_range);
            $("#id_list").empty();

            $.each(g_user_labeled_id, function (i, id_name) {
                $("#id_list").append("<option value=" + i + ">" + i + "/" + g_user_labeled_id.length + "</option>");
            });
            $("#id_list").val(current_labeler_last_index);
            $("#seleted_id").val("ID_" + g_user_labeled_id[g_current_id_index]);
            get_all_data(current_database_name);
            // 监听标注id范围变化事件
            $('#id_list').on('change', function(e){
                if (e.originalEvent) {
                    g_current_id_index = parseInt($("#id_list").val());
                    var current_database_name = $("#database_list").find("option:selected").text().slice(4);
                    get_all_data(
                        current_database_name
                    );
                    $("#scrollContent").scrollTop(0)
                }
            });
        },
        error:function(data){
            alert(data.responseJSON["msg"]);
            top.location.reload()
        }
    });

}

function get_all_data(
    current_database_name,
) {
    var dataurl='/face_inside_get_all_data/';
    $.unique(g_current_main_imgs);
    $.unique(g_current_sec_imgs);
    var data=JSON.stringify({
        current_database_name: current_database_name,//当前的数据库名称
        current_id_index: g_current_id_index,//当前的主类index
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
    });//发送cookie，验证登录

    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            //每次加载时重置一些参数
            var json_data=JSON.parse(data);
            var current_main_img_url_list = json_data['current_main_img_url_list'];//主类图片链接列表
            var current_sec_img_url_list  = json_data['current_sec_img_url_list'];//次类图片链接集合
            var user_labeled_id = json_data['user_labeled_id'];
            var current_id_range = json_data['current_id_range'];
            var labeler = json_data['labeler'];
            var checker = json_data['checker'];
            g_user_labeled_id = user_labeled_id;
            g_current_main_imgs = current_main_img_url_list;
            g_current_sec_imgs = current_sec_img_url_list;

            sec_pic_index = 0;//id变化重置次类图片当前序列
            bad_num = 0;

            $('#seleted_id_range').val(current_id_range);
            $("#id_list").empty();

            $.each(g_user_labeled_id, function (i, id_name) {
                $("#id_list").append("<option value=" + i + ">" + i + "/" + g_user_labeled_id.length + "</option>");
            });
            $("#id_list").val(g_current_id_index);
            $("#seleted_id").val("ID_" + g_user_labeled_id[g_current_id_index]);
            $("#labeler").val(labeler);
            $("#checker").val(checker);
            // 加载主类图片
            add_search_image(g_current_main_imgs);
            // 加载次类图片
            add_query_result_image(g_current_sec_imgs);

        },
        error:function(data){
            alert(data.responseJSON["msg"]);
            top.location.reload()
        }
    });
}

// 前进
function get_next_id_data(){
    $("#scrollContent").scrollTop(0);

    if (g_user_labeled_id.length === 0){
        console.log("还没有获取列表");
        return
    }
    var current_database_name = $("#database_list").find("option:selected").text().slice(4);
    save_laebl_result(current_database_name);
    g_current_id_index++;
    get_all_data(
            current_database_name
    );
}

// 后退
function get_back_id() {
    $("#scrollContent").scrollTop(0);

    if (g_user_labeled_id.length === 0){
        console.log("还没有获取列表");
        return
    }

    var current_database_name = $("#database_list").find("option:selected").text().slice(4);
    save_laebl_result(current_database_name);
    if (g_current_id_index > 0)
        g_current_id_index--;
    get_all_data(
            current_database_name
    );
}

// 添加主类图片
function add_search_image(src_set) {
    // 自定义框架
    $('#search_images').html('<div class="pics-wrap col-md-12" id="pics-wrap" style="width:1440px"></div>');
    for(var i=0;i<src_set.length;i++)
    {
        $('#pics-wrap').append('<div class="show_pics col-lg-2" style="display: block; opacity: 1; top: 0px; left: 0px;height: 250px;float: left;align-items: center">' +
            '<img class="img row img-thumbnail" id="main_img_'+i+'" src="'+src_set[i]+'" alt="'+src_set[i]+'" style="width: 88%;height: 85%; margin: 0px;">' +
            '<div class="caption">\n'+
            '      <p>' +
            '           <a href="#" class="del_btn btn btn-danger" role="button" value="'+src_set[i]+'" style="width: 88%;height: 88%">' +
            '                        删除' +
            '           </a> ' +
            '      </p>' +
            '</div>' +
            '</div>');
    }
    // 点击删除按钮后重载图片
    $(".del_btn").on("click",function () {
        g_current_sec_imgs.push($(this).attr('value'));
        g_current_main_imgs.splice($.inArray($(this).attr('value'),g_current_main_imgs),1);
        // 加载主类图片
        add_search_image(g_current_main_imgs);
        // 加载次类图片
        add_query_result_image(g_current_sec_imgs);
    })
}

// 添加次类图片
function add_query_result_image(src_set) {
    // 展示待选择的图片
    show_result_pics(src_set);
    $("#rest_num").text("剩余次类图片数:" + (src_set.length  - sec_pic_index).toString());
    $("#pass_num").text("已放弃图片数:"+bad_num.toString())
}

function show_result_pics(src_set) {
    // 每次显示一张次类图片
    $('#result_pics-wrap').html("")
    if(src_set.length > 0)
    {
        $('#result_pics-wrap').html(
            '       <img class="img img-thumbnail" id="sec_pic" src="'+src_set[sec_pic_index]+'" alt="'+src_set[sec_pic_index]+'" style="width: 88%;height: 88%">' +
            '           <div class="caption">' +
            '              <p>' +
            '                     <a href="#" class="persist_btn btn btn-success" role="button" value="'+src_set[sec_pic_index]+'" style="width: 43%">' +
            '                                  保留' +
            '                     </a> ' +
            '                     <a href="#" class="pass_btn btn btn-danger" role="button" value="'+src_set[sec_pic_index]+'" style="width: 43%">' +
            '                                  放弃' +
            '                     </a> ' +
            '               </p>');
    }

    // 点击保留就把该图片加入到主类
    $(".persist_btn").on("click",function () {
        g_current_main_imgs.push($(this).attr("value"));
        g_current_sec_imgs.splice($.inArray($(this).attr('value'),g_current_sec_imgs),1);
        bad_num = 0;
        // 加载主类图片
        add_search_image(g_current_main_imgs);
        // 加载次类图片
        add_query_result_image(g_current_sec_imgs);

    });
    // 点击放弃就跳过该图
    $(".pass_btn").on("click",function () {
       bad_num ++;
       if (bad_num === 3 || src_set.length === 1)
       {
           get_next_id_data()
       }
       else {
           sec_pic_index++;
           show_result_pics(src_set);
           $("#rest_num").text("剩余次类图片数:" + (src_set.length  - sec_pic_index).toString());
           $("#pass_num").text("已放弃图片数:"+bad_num.toString())
       }

    });
    // 图片放大
    $(".img").on('click',function(){
        var _this = $(this);//将当前的pimg元素作为_this传入函数
        imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
    });

}

// 放大图片
function imgShow(outerdiv, innerdiv, bigimg, _this){
    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
    $(bigimg).attr("src", src);//设置#bigimg元素的src属性
    /*获取当前点击图片的真实大小，并显示弹出层及大图*/

    var windowW = $(window).width();//获取当前窗口宽度
    var windowH = $(window).height();//获取当前窗口高度
    var realWidth = _this.width();//获取图片真实宽度
    var realHeight = _this.height();//获取图片真实高度
    var scale = Math.max(windowW/realWidth,windowH/realHeight);//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
    if(scale < 1)
    {
        scale = Math.min(realWidth/windowW,realHeight/windowH);
        scale/=0.4;
        $(bigimg).css({"width":realWidth/scale,"height":realHeight/scale});//以最终的宽度对图片缩放
    }
    else
        {
            scale*=0.4;
            $(bigimg).css({"width":realWidth*scale,"height":realHeight*scale});//以最终的宽度对图片缩放
        }

    var w = (windowW-realWidth*scale)/2;//计算图片与窗口左边距
    var h = (windowH-realHeight*scale)/2;//计算图片与窗口上边距
    $(innerdiv).css({"top":h, "left":w});//设置#innerdiv的top和left属性
    $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg

    $(outerdiv).click(function(){//再次点击淡出消失弹出层
        $(this).fadeOut("fast");
    });

}

// 保存当前group的标注信息
function save_laebl_result(current_database_name) {
    // 当全部都表完了才保存
    var dataurl = '/face_inside_save_label_info/';
    var data=JSON.stringify({
            current_database_name:current_database_name,//当前的数据库名称
            current_good_imgs: g_current_main_imgs,//当前的good图片集合
            current_bad_imgs: g_current_sec_imgs,//当前的bad图片集合
            current_id_index: g_current_id_index,//当前index
    });
    $.ajax({
        url: dataurl,
        type: "POST",
        data:data,
        success: function (data) {
            var json_data=JSON.parse(data);
            var msg = json_data["msg"];
            console.log(msg);
        },
        error: function (data) {
            alert("保存失败！");
        }
    });

}