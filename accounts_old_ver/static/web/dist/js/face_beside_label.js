// 人脸类间清理前端
// 数据库列表
g_database_list_json = [];
// 标注人已标的序列
g_user_labeled_id = [];
//TODO: might reduce global var
g_current_cluster_id_index = 0;

// 当前聚类标注结果
g_current_cluster_label_result = [];

// 当前id图片集合
g_current_ids_img_url_list = {};

// 当前聚类所包含的id
g_current_cluster_contains_id = [];

// 当前聚类对比的index
current_search_id_index = 0;

$(function () {
    // using ajax to get database and camera list
    var dataurl = '/face_beside_get_database_list/';
    $.ajax({
        url: dataurl,
        type: "GET",
        success: function (data) {
            var json_data = JSON.parse(data);
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
    $('#database_list').on('change', function(e){
        if (e.originalEvent) {
            var current_database_name = $("#database_list").find("option:selected").text().slice(4);
            get_id_range(current_database_name);
            $("#scrollContent").scrollTop(0)
        }
    });
    // 按键事件
    $(document).keyup(function (event) {
        switch(event.keyCode) {
            case 68: // "d"
                get_next_group();
                return;
            case 65: // "a"
                get_back_id();
                return;
        }
    });
    // 重置当前聚类的关系
    $('#reset_group_link').unbind('click').click(function () {
        g_current_cluster_label_result.length = 0;
        current_search_id_index = 0;
        add_query_result_image(g_current_cluster_contains_id);
        add_search_image(g_current_cluster_contains_id[current_search_id_index]);
    });
});

function get_id_range(current_database_name) {
    var dataurl='/face_beside_get_id_range/';
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
            var current_labeler_last_index = user_labeled_id.length - 1;// 当前标注人最后标注的位置
            var labeler = json_data['labeler'];
            $('#seleted_id_range').val(current_id_range);

            g_user_labeled_id = user_labeled_id;
            g_current_cluster_id_index = current_labeler_last_index;
            get_all_data(current_database_name);
            // 监听标注id范围变化事件
            $('#id_list').on('change', function(e){
                if (e.originalEvent) {
                    g_current_cluster_id_index = parseInt($("#id_list").val());
                    var current_database_name = $("#database_list").find("option:selected").text().slice(4);
                    get_all_data(
                        current_database_name
                    );
                    $("#scrollContent").scrollTop(0)
                }
            });
            $('#labeler').val(labeler)
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
    var dataurl='/face_beside_get_all_data/';
    var data=JSON.stringify({
        current_database_name:current_database_name,//当前的数据库名称
        current_cluster_id_index: g_current_cluster_id_index,//当前的聚类序号
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
            var current_cluster_contains_id = json_data['current_cluster_contains_id'];//当前聚类所含id
            var current_ids_img_url_list  = json_data['current_ids_img_url_list'];//当前聚类所含id的图片集合{id:[img1url,imgurl2,...],}
            var user_labeled_id = json_data['user_labeled_id'];
            var current_id_range = json_data['current_id_range'];
            var current_cluster_label_result = json_data['cluster_label_result']; //当前聚类id的标注结果[[id0,id1],[id2,id3]]，如果是[]，则没标注
            var labeler = json_data['labeler'];
            var checker = json_data['checker'];
            g_current_ids_img_url_list = current_ids_img_url_list;
            g_current_cluster_label_result = current_cluster_label_result;
            g_current_cluster_contains_id = current_cluster_contains_id;
            g_user_labeled_id = user_labeled_id;
            // reset
            current_search_id_index = 0;// 进入新的一组图片时重置次类图片当前序列

            $('#seleted_id_range').val(current_id_range);
            $("#id_list").empty();
            $.each(g_user_labeled_id, function (i, id_name) {
                $("#id_list").append("<option value=" + i + ">" + i + "/" + g_user_labeled_id.length + "</option>");
            });
            $("#id_list").val(g_current_cluster_id_index);
            $("#seleted_id").val("ID_" + g_user_labeled_id[g_current_cluster_id_index]);

            // 根据标注数据来决定目标类和底库类的展示效果
            if(g_current_cluster_label_result.length < 1){
                // 没有标注数据就把从第一个开始
                add_query_result_image(g_current_cluster_contains_id);
                add_search_image(g_current_cluster_contains_id[current_search_id_index]);
            }
            else
            {
                // 有标注的情况下就展示标注结果
                for(var i=0;i<g_current_cluster_label_result.length;i++)
                {
                    show_label_result(g_current_cluster_label_result);
                }

            }

            $("#old_labeler").val(labeler);
            $("#old_checker").val(checker);
        },
        error:function(data){
            console.log("get Info is wrong");
            console.log(data);
            alert("获取数据出错，请登陆，或联系管理员!");
            top.location.reload()
        }
    });
}

// 添加底库类图片
function add_query_result_image(result_ids) {
    $('#result_pics-wrap').html('');
    $('#result_pics-wrap').css("height",result_ids.length*200);
    var src_set;
    for(var k=0;k<result_ids.length;k++)
    {
        if (k === current_search_id_index)
            continue;
        src_set = g_current_ids_img_url_list[result_ids[k]];
        $('#result_pics-wrap').append(
            '<label class="btn-success btn" style="float: left;margin-top: 8px;align-items: center"><input class="checked-class" type="checkbox" value="'+result_ids[k]+'" style="width: 15px;height: 15px">相似</label>' +
            '<div class="btn btn-primary" style="margin-top: 8px;">ID:'+result_ids[k]+'</div>' +
            '<div class="scroller_container" style="height: 220px;width: 1500px; margin-top: 10px;margin-bottom: 20px;overflow-x: auto;" >' +
        '<div class="pics-wrap" id="pics-wrap-'+k.toString()+'" style="width:'+src_set.length*150+'px"></div></div>');
        for(var i=0;i<src_set.length;i++)
        {
            $("#pics-wrap-"+k.toString()).append('<div class="show_pics" style="display: block; opacity: 1; top: 0px; left: 0px; width: 150px; height: 200px;float: left; left: 10px">' +
                '<img class="img img-thumbnail" id="result_img_'+i+'" src="'+src_set[i]+'" alt="'+src_set[i]+'" style="width: 90%;height: 90%"></div>')
        }
    }
    // 确定相似时id变色
    $(".checked-class").on("click",function () {
        if ($(this).is(':checked'))
        {
            $(this).parent().next().attr("class","btn btn-warning")
        }
        else
            $(this).parent().next().attr("class","btn btn-primary")

    })
}

// 添加目标类图片
function add_search_image(id) {
    var src_set = g_current_ids_img_url_list[id];
    show_search_pics(src_set);
    // 显示id
    $('#search_id').text("ID:"+id.toString());
}

function show_search_pics(src_set) {
    $('#search_images-wrap').html('');
    var imgs_height = src_set.length*200;
    $('#search_images-wrap').html('<div class="pics-wrap" id="search_pics-wrap" style="width:200px;height: '+imgs_height+'px;top: 0px"></div>');
    for(var i=0;i<src_set.length;i++)
    {
        $('#search_pics-wrap').append('<div class="show_pics" style="display: block; opacity: 1; top: 0px; left: 0px; width: 180px; height: 200px; margin-left: 30px">' +
            '<img class="img img-bordered" id="search_img_'+i+'" src="'+src_set[i]+'" alt="'+src_set[i]+'" style="width: 90%;height: 90%"></div>')
    }

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

// 下一组
function get_next_group() {
    var temp = [];// 记录当次的标注信息
    temp.push(g_current_cluster_contains_id[current_search_id_index]);
    $('.checked-class').each(function () {
        if($(this).is(':checked'))
        {
            temp.push($(this).val())
        }
    });
    g_current_cluster_label_result.push(temp);
    // 对比聚类的所有id，找出没有关系的
    var no_link = [];
    var has_link = [];
    for(var i=0;i<g_current_cluster_label_result.length;i++)
    {
        has_link = has_link.concat(g_current_cluster_label_result[i]);
    }
    for(var j=0;j<g_current_cluster_contains_id.length;j++)
    {
        if(!has_link.includes(g_current_cluster_contains_id[j]))
        {
            no_link.push(g_current_cluster_contains_id[j])
        }
    }
    if(no_link.length > 1)
    {
        current_search_id_index = g_current_cluster_contains_id.indexOf(no_link[0]);
        add_query_result_image(no_link);
        add_search_image(g_current_cluster_contains_id[current_search_id_index]);
    }
    else
    {
        if(no_link.length === 1)
        {
            // 如果只剩一个就保存进入下一个聚类id
            g_current_cluster_label_result.push(no_link)
        }
        get_next_id_data();
    }
}

// 下一个聚类id
function get_next_id_data(){
    $("#scrollContent").scrollTop(0);
    if (g_user_labeled_id.length === 0){
        console.log("还没有获取列表");
        return
    }
    var current_database_name = $("#database_list").find("option:selected").text().slice(4);
    save_laebl_result(current_database_name);
    g_current_cluster_id_index++;
    get_all_data(
            current_database_name
    );
}

// 回退上一个聚类id
function get_back_id() {
     $("#scrollContent").scrollTop(0);

    if (g_user_labeled_id.length === 0){
        console.log("还没有获取列表");
        return
    }
    var current_database_name = $("#database_list").find("option:selected").text().slice(4);
    save_laebl_result(current_database_name);
    if (g_current_cluster_id_index > 0)
        g_current_cluster_id_index--;
    else
        alert("已经到第一个id!");
    get_all_data(
            current_database_name
    );
}

// 保存当前group的标注信息
function save_laebl_result(current_database_name) {
    // 当全部都表完了才保存
    var temp = [];
    for (var i =0;i<g_current_cluster_label_result.length;i++)
        temp = temp.concat(g_current_cluster_label_result[i]);
    if (temp.length === g_current_cluster_contains_id.length)
    {
        var dataurl = '/face_beside_save_label_info/';
        var data=JSON.stringify({
            current_database_name:current_database_name,//当前的数据库名称
            current_cluster_id_index:g_current_cluster_id_index,//当前聚类index
            label_result:g_current_cluster_label_result,// 标注结果
        });
        console.log(data);
        $.ajax({
        url: dataurl,
        type: "POST",
        data:data,
        success: function (data) {
            var json_data=JSON.parse(data);
            var msg = json_data["msg"]
            console.log(msg);
        },
        error: function (data) {
            alert("保存失败！");
        }
    });
    }

}

// 展示标注结果
function show_label_result(label_result) {
    $('#result_pics-wrap').html('');
    $('#result_pics-wrap').css("height",label_result.length*200);
     $('#search_images-wrap').html('');
      $('#search_id').html('无');
    var cluster, src_set;
    for(var i=0; i<label_result.length;i++)
    {
        cluster = label_result[i];
        src_set = [];
        for(var j=0;j<cluster.length;j++)
        {
            // 选取一个图片进行展示
            src_set.push(g_current_ids_img_url_list[cluster[j].toString()][0]);
        }
        $('#result_pics-wrap').append(
            '<div class="btn btn-warning" style="margin-top: 8px;">第'+(i+1)+'族</div>' +
            '<div class="scroller_container" style="height: 220px;width: 1500px; margin-top: 10px;margin-bottom: 20px;overflow-x: auto;" >' +
            '<div class="pics-wrap" id="pics-wrap-'+i.toString()+'" style="width:'+src_set.length*150+'px"></div></div>');
        for(var k=0;k<src_set.length;k++)
        {
            $("#pics-wrap-"+i.toString()).append(
                '<div class="show_pics" style="display: block; opacity: 1; top: 0px; left: 0px; width: 150px; height: 200px;float: left; left: 10px">' +
                '<div class="btn btn-primary" style="margin-top: 2px;width: 90%;">ID:'+k+'</div>'+
                '<img class="img img-thumbnail" id="result_img_'+k+'" src="'+src_set[k]+'" alt="'+src_set[k]+'" style="width: 90%;height: 90%"></div>')
        }
    }

    // 图片放大
    $(".img").on('click',function(){
        var _this = $(this);//将当前的pimg元素作为_this传入函数
        imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
    });
}