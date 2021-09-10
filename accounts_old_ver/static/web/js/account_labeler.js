// 当前任务名称
g_task_name = "";
// 当前月份
g_current_date = "";
// 当前任务对应的指标
g_target = [];
// 当前任务对应的子任务信息
g_all_child_task_info = [];
// 指标对应的单价
g_target_weight = {};


$(function () {
    jQuery(document).ajaxSend(function(event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
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
    // 初始化加载任务列表及其子任务
    var dataurl='/get_date_and_task/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
            var json_data = JSON.parse(data);
            var all_date = json_data["all_date"];
            var all_date_task_dict = json_data["all_date_task_dict"];
            var total_cost = json_data["total_cost"];
            var task_list;
            // 加载月份
            for(var i=0;i<all_date.length;i++)
            {
                $('#date_list').append('<li class="has-children"><a href="#0" title="" class="date_name">'+all_date[i]+'</a>' +
                    '<ul class="sub-menu" id="'+all_date[i]+'_task_list">' +
                    '</ul>' +
                    '</li>');
                task_list = all_date_task_dict[all_date[i]];
                for (var j=0; j<task_list.length; j++)
                {
                    $('#'+all_date[i]+'_task_list').append('<li><a class="task_name" title="" style="width: 280px">'+task_list[j]+'</a></li>')
                }
            }

            $('.header__nav .has-children').children('a').on('click', function (e) {
                e.preventDefault();
                $(this).toggleClass('sub-menu-is-open')
                    .next('ul')
                    .slideToggle(200)
                    .end()
                    .parent('.has-children')
                    .siblings('.has-children')
                    .children('a')
                    .removeClass('sub-menu-is-open')
                    .next('ul')
                    .slideUp(200);

            });

            // 点击日期名时加载对应的信息
            $(".date_name").on("click",function () {
                g_current_date = $(this).text();
                get_total_cost();
            });

            // 点击任务时
            $(".task_name").on("click",function () {
                g_task_name = $(this).text();
                get_task_info();
                $('.task_name').each(function () {
                    $(this).css("color","");
                });
                $(this).css("color","red");
            })
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
        }
    });
});

// 获取任务数据信息
function get_task_info() {
    jQuery(document).ajaxSend(function(event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
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
    var dataurl='/get_task_detail_info/';
    var data=JSON.stringify({
        task_name: g_current_date+"-"+g_task_name, //任务
    });
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var data_json = JSON.parse(data);
            g_all_child_task_info = data_json["all_child_task_info"];
            g_target = data_json["target"];
            g_target_weight = data_json["target_weight"];//指标的权重
            show_child_task_info();
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
        }
    });
}

// 通过g_all_child_task_info来展示信息
function show_child_task_info() {

    var table_html = "<tr><th>"+g_task_name+"</th></tr><tr>";
    var total_cost = 0;
    for(var t=0;t<g_target.length;t++)
    {
        if (g_target[t].indexOf("任务总数")>-1 || g_target[t].indexOf("每小时任务标注量")>-1 || g_target[t].indexOf("任务总张数")>-1 || g_target[t].indexOf("任务总框数")>-1)
            continue;
        if(g_target_weight[g_target[t]]>0)
            table_html+="<th>"+g_target[t]+"/"+g_target_weight[g_target[t]]+"元</th>";
        else
            table_html+="<th>"+g_target[t]+"</th>";
    }
    table_html += "</tr>";
    for(var i=0;i<g_all_child_task_info.length;i++)
    {
        table_html += "<tr class='child-task-content'>";
        $.each(g_target,function (j,key) {
            // 这两项对标注人不可见
            if (key.indexOf("任务总数") > -1 || key.indexOf("每小时任务标注量") > -1 || key.indexOf("任务总张数") > -1 || key.indexOf("任务总框数") > -1)
                console.log("");
            else {
                if (key.indexOf("费用") > -1 ){
                total_cost += parseFloat(g_all_child_task_info[i][key]);
                table_html += "<td><input class='target_val' type='text' value='"+ g_all_child_task_info[i][key] +"' disabled="+true+"></td>"

            }
            else
                table_html += "<td><input class='target_val' type='text' value='"+ g_all_child_task_info[i][key] +"'></td>"
            }

        });
        table_html += "<td><a class='del_child_task'>删除</a></td></tr>"
    }
    total_cost = Number(total_cost).toFixed(2);
    table_html += "<tr><th>总费用</th><th>"+total_cost+"<th></tr>";

    $("#target-table").html(table_html);

    $(".del_child_task").on("click",function () {
        $(this).parent().parent().remove()
    });

    $("#task_option").html("<a id='add_child_task' style=\"margin-right: 300px;\">新增子任务</a><a id='save_edit'>保存修改</a>")
    // 新增子任务
    $("#add_child_task").on("click",function () {
        if(g_task_name === "")
            return;
        var add_task_input_html = "<tr class='child-task-content'>";
        for (var i=0;i<g_target.length;i++)
        {
            if (g_target[i].indexOf("任务总数")> -1 || g_target[i].indexOf("每小时任务标注量")> -1 || g_target[i].indexOf("任务总张数")> -1 ||  g_target[i].indexOf("任务总框数")> -1)
                console.log("");
            else {
                if (g_target[i].indexOf("费用")> -1)
                    add_task_input_html += "<td><input class='target_val' type='text' disabled="+true+"></td>";
                else
                    add_task_input_html += "<td><input class='target_val' type='text' placeholder='请输入"+g_target[i]+"'></td>"
            }
        }
        add_task_input_html += "</tr>";
        $("#target-table").append(add_task_input_html);
    });
    // 保存修改
    $("#save_edit").on("click",function () {
        save_child_task_info();
        get_task_info()
    });
}

function save_child_task_info() {
    jQuery(document).ajaxSend(function(event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
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
    });//发送cookie，验证登录\
    var all_child_task_info = [];
    var child_info = {};
    $(".child-task-content").each(function () {
        $(this).find('.target_val').each(function (j,input) {
            child_info[g_target[j%g_target.length]] = $(input).val();
        });
        console.log(child_info);
        all_child_task_info.push(child_info);
        child_info = {}
    });
    console.log(all_child_task_info);
    var dataurl = '/save_child_task_info/';
    // 获取页面上的信息
    var data=JSON.stringify({
        task_name: g_current_date+"-"+g_task_name, //任务
        child_task_info: all_child_task_info,// 当前任务的子任务信息
    });
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var data_json = JSON.parse(data);
            var msg = data_json["msg"];
            alert(msg)
            },
        error:function(data){
            console.log(data);
            top.location.reload()
        }
    });
}

function get_total_cost() {
    jQuery(document).ajaxSend(function(event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
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
    var dataurl='/get_total_cost/';
    var data=JSON.stringify({
        date: g_current_date, //rq
    });
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var data_json = JSON.parse(data);
            var total_cost = data_json["total_cost"];
            total_cost = Number(total_cost).toFixed(2);
            $("#target-table").html("<tr><th>"+g_current_date+"</th><th>总费用</th><th>"+total_cost+"</th></tr>");
            $("#task_option").html("")
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
        }
    });
}
