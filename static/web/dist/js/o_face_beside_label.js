// 人脸类间清理前端
g_database_list_json = [];
g_database_id_range_dict_json = {};

$(function () {
    // using ajax to get database and camera list
    var dataurl = '/face_beside_get_database_id_range_list/';
    $.ajax({
        url: dataurl,
        type: "GET",
        success: function (data) {
            var json_data = JSON.parse(data)
            // 获取数据库列表
            $.each(json_data['database_list'], function (i, database_name) {
                g_database_list_json.push(database_name);
                g_database_id_range_dict_json[database_name] = json_data['database_id_range_list'][i]
            });

            $.each(g_database_list_json, function (i, database_name) {
                $("#database_list").append("<option value=" + i + ">数据源：" + database_name + "</option>");
                if (i == 0) {
                    $("#database_list").val(i);
                }
            });
            if (g_database_list_json.length > 0) {
                $.each(g_database_id_range_dict_json[g_database_list_json[0]], function (i, id_range_name) {
                    $("#id_range_list").append("<option value=" + i + ">" + id_range_name + "</option>");
                });

            }
        },
        error: function (data) {
            console.log("get_database_id_range_list is wrong");
            //console.log(data)
            console.log(data)
            alert("获取数据库和标注对象序号列表出错，请登陆，或联系管理员...")
            //loading.stop()
        }
    });

    // logic for database change
    $("#database_list").change(function () {
        $("#id_range_list").empty()
        $.each(g_database_id_range_dict_json[g_database_list_json[parseInt($("#database_list").val())]], function (i, id_range_name) {
            $("#id_range_list").append("<option value=" + i + ">" + id_range_name + "</option>");
        });
        $("#seleted_id_range").val("当前标注对象序号范围");
        //TODO: add logic to clear all gallery
    })

});

g_id_range_name_list_json = [];

//TODO: might reduce global var
g_current_cluster_id_index = 0;
// 当前要删除的图片
g_current_id_del_pics=[];
// 标注结果
g_all_label_result = {};
// 当前目标类的索引
current_search_id_index = 0;
// 当前id图片集合
g_current_ids_img_url_list = {};
// 当前聚类所包含的id
g_current_cluster_contains_id = [];

function get_all_data(
    current_database_name,
    current_id_range_name,
    current_labelperson_name
) {
    var dataurl='/face_beside_get_all_data/';
    var data=JSON.stringify({
        current_database_name:current_database_name,//当前的数据库名称
        current_id_range_name:current_id_range_name,//当前的标注对象范围
        current_labelperson_name:current_labelperson_name,//当前的标注人
        current_cluster_id_index:g_current_cluster_id_index,//当前的聚类序号
        current_del_pics:g_current_id_del_pics,//当前聚类删除的图片
        all_cluster_label_result:g_all_label_result //标注结果
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
                        console.log(cookieValue);
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
            g_current_id_del_pics.length = 0;//当前聚类图片中待删的图片列表

            var json_data=JSON.parse(data);
            //console.log(json_data);
            var labelperson_list = json_data['labelperson_list'];//标注人列表
            var all_id = json_data['all_clusters'];//所有聚类集合
            var current_cluster_contains_id = json_data['current_cluster_contains_id'];//当前聚类所含id
            var current_cluster_id_index  = json_data['current_cluster_id_index'];//当前聚类图片序列
            var current_ids_img_url_list  = json_data['current_ids_img_url_list'];//当前聚类所含id的图片集合{}
            var current_label_name = json_data['current_label_name'];//当前的标注人/结果
            var current_labeler_last_index = json_data['current_labeler_last_index'];// 当前标注人最后标注的位置
            var all_label_data = json_data['all_label_result'];//所有的标注数据

            g_current_ids_img_url_list = current_ids_img_url_list;
            g_current_cluster_id_index = current_cluster_id_index;
            g_all_label_result = all_label_data;
            g_current_cluster_contains_id = current_cluster_contains_id;

            //设置标注人
            if (current_labelperson_name == ""){
                $("#label_result_list").empty()

                $.each(labelperson_list, function (i, laberperson_name){
                    $("#label_result_list").append("<option value=" + i + ">" + laberperson_name + "</option>");
                    if(laberperson_name==current_label_name)
                    {
                        $("#label_result_list").val(i);
                    }
                });

                current_labelperson_name = $("#label_result_list").find("option:selected").text()
            }
            //console.log($("#label_result_list").find("option:selected").text())

            // 初始化加载分区范围
            if (g_current_cluster_id_index == 0){
                $("#id_list").empty();
                var id_range_start = parseInt(current_id_range_name.split('--')[0]);
                var id_range_end = parseInt(current_id_range_name.split('--')[1]);
                g_id_range_name_list_json = all_id.slice(id_range_start, id_range_end + 1)
                $.each(g_id_range_name_list_json, function (i, id_name) {
                    $("#id_list").append("<option value=" + i + ">" + i + "/" + g_id_range_name_list_json.length + "</option>");
                });
            }

            $("#id_list").val(g_current_cluster_id_index);

            $("#seleted_id").val("ID_" + g_id_range_name_list_json[g_current_cluster_id_index]);

            $("#history_id").val(current_labeler_last_index);

            // 根据标注数据来决定目标类和底库类的展示效果
            // 加载目标类图片
            var current_link = [];
            if(current_search_id_index==current_cluster_contains_id.length)
            {
                alert('已到最后!');
                current_search_id_index-=1;
            }
            $.each(g_all_label_result[g_current_cluster_id_index.toString()],function (k,link) {
                for(var i=0;i < link.length;i++)
                {
                    if(current_cluster_contains_id[current_search_id_index] == link[i])
                    {
                        current_link = link;
                        break;
                    }
                }
            });
            var query_ids = [];//记录当前目标类的有关系的类
            if(current_link.length > 0)// 如果该组已有关联关系
            {
                for(var i=0;i<current_link.length;i++)
                {
                    if(current_link[i]!=current_cluster_contains_id[current_search_id_index])
                    {
                        query_ids.push(current_link[i]);
                    }
                }
                add_query_result_image(query_ids);
                $('.checked-class').each(function () {
                    $(this).prop('checked',true);
                });
            }
            else // 如果该组无关联关系，则将其它同样没有关联关系的作为底库展示
                {
                    var not_suit = false;
                    for(var j=0;j<current_cluster_contains_id.length;j++)
                    {
                        if(j==current_search_id_index)
                        {
                            continue
                        }
                        $.each(g_all_label_result[g_current_cluster_id_index.toString()],function (k,link) {
                            for(var i=0;i<link.length;i++)
                            {
                                if(current_cluster_contains_id[j] == link[i])
                                {
                                    not_suit = true;
                                    break;
                                }
                            }
                            if(not_suit){
                                return false;
                            }
                        });
                        if(!not_suit)
                        {
                            query_ids.push(current_cluster_contains_id[j]);
                        }
                        not_suit = false
                    }
                    add_query_result_image(query_ids);
            }
            // 加载目标类
            add_search_image(current_cluster_contains_id[current_search_id_index]);
            // 显示进度
            if(current_cluster_contains_id.length > 0)
            {
                $('#current_cluster_progress').text("进度："+current_search_id_index.toString()+"/"+(current_cluster_contains_id.length - 1).toString())
            }
            else
                $('#current_cluster_progress').text("进度："+current_search_id_index.toString()+"/"+current_cluster_contains_id.length.toString())
        },
        error:function(data){
            console.log("get Info is wrong");
            console.log(data);
            alert("获取数据出错，请登陆，或联系管理员!");
            top.location.reload()
        }
    });
}

g_id_range_start_and_end = [];
function fetch_video_data() {
    $("#scrollContent").scrollTop(0)
    if ($("#id_range_list").val().length != 1) {
        alert("请选择一个序号范围");
        return
    }
    $("#seleted_id_range").val($("#id_range_list").find("option:selected").text());
    g_id_range_start_and_end = [];
    g_id_range_start_and_end.push(parseInt($("#id_range_list").find("option:selected").text().split('--')[0]));
    g_id_range_start_and_end.push(parseInt($("#id_range_list").find("option:selected").text().split('--')[1]));
    // clear global var
    g_current_cluster_id_index = 0;

    // ajax get_all_data
    var current_database_name = $("#database_list").find("option:selected").text().slice(4)
    var current_id_range_name = $("#id_range_list").find("option:selected").text()

    var current_labelperson_name = "";

    get_all_data(
        current_database_name,
        current_id_range_name,
        current_labelperson_name
    );

    // 监听标注人变化事件
    $("#label_result_list").change(function (e) {
        if (e.originalEvent) {
            console.log("$(\"#label_result_list\").change(function ()" + $(this).val())

            var current_database_name = $("#database_list").find("option:selected").text().slice(4)//切掉“数据源：”得到后面的文件夹名
            var current_id_range_name = $("#id_range_list").find("option:selected").text();
            var current_labelperson_name = $("#label_result_list").find("option:selected").text()

            //switch label_result not save current change
            g_current_cluster_id_index = 0;

            get_all_data(
                current_database_name,
                current_id_range_name,
                current_labelperson_name
            );
            $("#scrollContent").scrollTop(0)
        }
    });

    // 监听标注id范围变化事件
    $('#id_list').on('change', function(e){
        //console.log("$('#id_list').on('change', function(){")
        if (e.originalEvent) {
            console.log("$('#id_list').on('change', function(){")

            var current_database_name = $("#database_list").find("option:selected").text().slice(4)
            var current_id_range_name = $("#id_range_list").find("option:selected").text();
            var current_labelperson_name = $("#label_result_list").find("option:selected").text();
            get_data_with_index(
                current_database_name,
                current_id_range_name,
                current_labelperson_name
            );
            //console.log('$("#scrollContent").scrollTop(0)')
            $("#scrollContent").scrollTop(0)
        }
    })
}

function get_data_with_index(
    current_database_name,
    current_id_range_name,
    current_labelperson_name
) {
    console.log("$(\"#id_list\").change(function ()" + $('#id_list').val());

    g_current_cluster_id_index = parseInt($('#id_list').val());

    get_all_data(
        current_database_name,
        current_id_range_name,
        current_labelperson_name
    )
}

function get_next_id_data(){
    //console.log('$("#scrollContent").scrollTop(0)')
    $("#scrollContent").scrollTop(0);
    if (g_id_range_name_list_json.length == 0){
        console.log("还没有获取列表");
        return
    }
    // 自动保存数据
    var key = g_current_cluster_id_index.toString();
    var id = $('#search_id').text();
    id = id.substring(3,id.length);
    console.log(id);
    save_id_links(id,key);

    if (parseInt($("#id_list").val()) == g_id_range_name_list_json.length - 1) {
        alert("已到最后一个id！");
        $("#id_list").val(parseInt($("#id_list").val()))
    }else{
        $("#id_list").val(parseInt($("#id_list").val()) + 1)
        // 能进入下一组再重置以下参数
        current_search_id_index = 0;
    }
    // 重载界面
    var current_database_name = $("#database_list").find("option:selected").text().slice(4);
    var current_id_range_name = $("#id_range_list").find("option:selected").text();
    var current_labelperson_name = $("#label_result_list").find("option:selected").text();
    get_data_with_index(
        current_database_name,
        current_id_range_name,
        current_labelperson_name
    );
}

// 添加底库类图片
function add_query_result_image(result_ids) {
    // 自定义框架
    $('#result_pics-wrap').html('');
    var src_set;
    for(var k=0;k<result_ids.length;k++)
    {
        $('#result_pics-wrap').append('<input class="checked-class" type="checkbox" value="'+result_ids[k]+'" style="height: 50px;width: 50px;float: left"><div style="height:50px;line-height: 50px;font-size: 30px">id:'+result_ids[k]+'</div><div class="scroller_container" style="height: 220px;width: 1200px;margin-top: 10px;margin-bottom: 20px;overflow-x: auto;" >' +
        '<div class="pics-wrap" id="pics-wrap-'+k.toString()+'" style="width:12000px"></div></div>');
        src_set = g_current_ids_img_url_list[result_ids[k]];
        for(var i=0;i<src_set.length;i++)
        {
            $("#pics-wrap-"+k.toString()).append('<div class="show_pics" style="display: block; opacity: 1; top: 0px; left: 0px; width: 150px; height: 200px;float: left;">' +
                '<img class="img" id="result_img_'+i+'" src="'+src_set[i]+'" alt="'+src_set[i]+'" style="width: 88%;height: 88%">' +
                '<input class="checked-pic" type="checkbox" value="'+src_set[i]+'" style="height: 20px;width: 20px">del pic '+(i+1)+'</div>')
                var img = document.getElementById("result_img_"+i.toString());
                getImgNaturalDimensions(img,function (dimension) {
                    var w = dimension.w,h = dimension.h;
                    var divid = Math.max(w/135,h/172);
                    if(divid < 1)
                    {
                        divid = Math.min(135/w,172/h);
                        $("#"+img.id).css({'width':w*divid,'height':h*divid})
                    }
                    else
                    {
                        $("#"+img.id).css({'width':w/divid,'height':h/divid})
                    }
                })
        }
    }
}

// 添加目标类图片
function add_search_image(id) {
    var src_set = g_current_ids_img_url_list[id];
    show_search_pics(src_set);

    // 下一组
    var key = g_current_cluster_id_index.toString();
    $('#next_group').unbind('click').click(function () {
        // 保存标注数据
        save_id_links(id,key);
        // 判断是否已标完关系
        var temp=[];
        $.each(g_all_label_result[key],function (k,link) {
            temp+=link;
        });
        var is_end = true;
        for(var i=0;i<g_current_cluster_contains_id.length;i++)
        {
            if(!temp.includes(g_current_cluster_contains_id[i]))
            {
                is_end = false;
                current_search_id_index = i;
                break;
            }

        }
        if(is_end || current_search_id_index === g_current_cluster_contains_id.length - 1)
        {
            alert('该组已标完！可进入下一组继续')
        }

        // 重载界面
        var current_database_name = $("#database_list").find("option:selected").text().slice(4)
        var current_id_range_name = $("#id_range_list").find("option:selected").text();
        var current_labelperson_name = $("#label_result_list").find("option:selected").text();
        get_data_with_index(
            current_database_name,
            current_id_range_name,
            current_labelperson_name
        );
    });

    // 上一组
    $('#back_group').unbind('click').click(function () {
        if(current_search_id_index > 0)
        {
            current_search_id_index--;
            // 重载界面
            var current_database_name = $("#database_list").find("option:selected").text().slice(4)
            var current_id_range_name = $("#id_range_list").find("option:selected").text();
            var current_labelperson_name = $("#label_result_list").find("option:selected").text();
            get_data_with_index(
            current_database_name,
            current_id_range_name,
            current_labelperson_name
        );
        }
    });

    // 删除选中的图片
    $('#del_sure').unbind('click').click(function () {
        $('.checked-pic').each(function () {
            if($(this).is(':checked'))
            {
                console.log('del_pic',$(this).val());
                g_current_id_del_pics.push($(this).val());
            }
        });
        if(g_current_id_del_pics.length > 0)
        {
            console.log(g_current_id_del_pics);
            // 确认删除图片后重载界面
            var current_database_name = $("#database_list").find("option:selected").text().slice(4)
            var current_id_range_name = $("#id_range_list").find("option:selected").text();
            var current_labelperson_name = $("#label_result_list").find("option:selected").text();
            get_data_with_index(
            current_database_name,
            current_id_range_name,
            current_labelperson_name
        );
            g_current_id_del_pics.length = 0;
        }
    });

    // 显示id
    $('#search_id').text("id:"+id.toString())

    // 重置当前聚类的关系
    $('#reset_group_link').unbind('click').click(function () {
        // 重置当前目标类的关系
        g_all_label_result[key].length = 0;
        current_search_id_index = 0;
        // 重载界面
        var current_database_name = $("#database_list").find("option:selected").text().slice(4);
        var current_id_range_name = $("#id_range_list").find("option:selected").text();
        var current_labelperson_name = $("#label_result_list").find("option:selected").text();
        get_data_with_index(
            current_database_name,
            current_id_range_name,
            current_labelperson_name
        );

    })

}

function show_search_pics(src_set) {
    // 自定义框架
    $('#search_images-wrap').html('');
    $('#search_images-wrap').html('<div class="pics-wrap" id="search_pics-wrap" style="width:370px;height: 100000px"></div>');
    for(var i=0;i<src_set.length;i++)
    {
        $('#search_pics-wrap').append('<div class="show_pics" style="display: block; opacity: 1; top: 0px; left: 0px; width: 185px; height: 200px;float: left;">' +
            '<img class="img" id="search_img_'+i+'" src="'+src_set[i]+'" alt="'+src_set[i]+'" style="width: 95%;height: 88%">' +
            '<input class="checked-pic" type="checkbox" value="'+src_set[i]+'" style="height: 20px;width: 20px">del pic '+(i+1)+'</div>')
            var img = document.getElementById("search_img_"+i.toString());
            getImgNaturalDimensions(img,function (dimension) {
                var w = dimension.w,h = dimension.h;
                var divid = Math.max(w/160,h/172);
                if(divid < 1)
                {
                    divid = Math.min(160/w,172/h);
                    $("#"+img.id).css({'width':w*divid,'height':h*divid})
                }
                else
                {
                    $("#"+img.id).css({'width':w/divid,'height':h/divid})
                }
            })
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

function getImgNaturalDimensions(oImg,callback) {
　　var nImg = new Image();
    nImg.src = oImg.src;
    nImg.onload = function() {
        var nWidth = nImg.width, nHeight = nImg.height;
        callback({w: nWidth, h:nHeight});
　　　　}
}

function save_id_links(id,key) {
    // 保存当前group的标注信息
    var temp = [];
    temp.push(id);
    if(!g_all_label_result.hasOwnProperty(key))
    {
        g_all_label_result[key] = [];
    }
    $('.checked-class').each(function () {
        if($(this).is(':checked'))
        {
            temp.push($(this).val())
        }
    });
    for(var i=0;i<temp.length;i++)
    {
        // 重置当前目标类的关系
        $.each(g_all_label_result[key],function (k,link) {
            for(var j = 0;j < link.length;j++)
            {
                if(temp[i] == link[j])
                {
                    g_all_label_result[key].splice(k,1);
                    return false
                }
            }
        })
    }
    g_all_label_result[key].push(temp);
}