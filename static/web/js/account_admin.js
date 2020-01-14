// 当前时间月
g_current_date = "";

// 当前任务名称
g_current_task_name = "";

// 当前人员名称
g_labeler_name = "";

// 所有月份
g_all_date_list = [];

// 月份与任务对照
g_all_date_task_dict = {};

// 月份与标注人对照
g_all_date_labeler_dict = {};

// 当前复制的任务
g_copy_content = {};

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
    // 初始化加载任务列表
    var dataurl='/get_date_task/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
            var json_data = JSON.parse(data);
            g_all_date_list = json_data["all_date"];
            update_date_list();
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
            // top.location.reload()
        }
    });
});

// 更新月份任务列表
function update_date_list() {
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
    var dataurl='/add_date_to_db/';
    var data=JSON.stringify({
        all_date: g_all_date_list, //任务列表
        all_date_task_dict: g_all_date_task_dict,
    });
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var json_data = JSON.parse(data);
            g_all_date_task_dict = json_data["all_date_task_dict"];
            g_all_date_list = json_data["all_date"];
            g_all_date_labeler_dict = json_data["all_date_labeler_dict"];
            // 加载编辑任务单元
            $('#edit_date').html('<li><a><input id="add_date" type="text" onkeydown="if(event.keyCode==13){add_date();return false}" style="background: white;padding-bottom: 0px;padding-top: 0px;margin-bottom: 0px;border-bottom-width: 0px;height: 30px;"></a></li><li class="header__nav" id="date_date_list"></li>');
            var task_list;
            for(var i=0;i<g_all_date_list.length;i++)
            {
                $('#date_date_list').append('<li class="has-children">\n' +
                    '                        <a href="#1" title="" class="date-name" style="width: 200px;">'+g_all_date_list[i]+'</a>' +
                    '                        <ul class="sub-menu" id="'+g_all_date_list[i]+'-task-list">\n' +
                    '                        </ul>' +
                    '                    </li>');
                task_list = g_all_date_task_dict[g_all_date_list[i]];
                for (var j=0;j<task_list.length;j++)
                {
                    $('#'+g_all_date_list[i]+'-task-list').append('<li><a class="task_name" title="" style="width: 200px;">'+task_list[j]+'</a></li>')
                }
                $('#'+g_all_date_list[i]+'-task-list').append('<li><a><input class="add_task" type="text" onkeydown="if(event.keyCode==13){add_task();return false}" style="background: white;padding-bottom: 0px;padding-top: 0px;margin-bottom: 0px;border-bottom-width: 0px;height: 30px;"></a></li>');

            }

            // 加载人员信息单元
            $('#labeler_info').html('<li class="header__nav" id="labeler_date_list"></li>');
            var labeler_list;
            for(var k=0;k<g_all_date_list.length;k++)
            {
                $('#labeler_date_list').append('<li class="has-children">' +
                    '                        <a href="#1" title="" class="date-name" style="width: 200px">'+g_all_date_list[k]+'</a>' +
                    '                        <ul class="sub-menu" id="'+g_all_date_list[k]+'-labeler-list">' +
                    '                        </ul>' +
                    '                    </li>');
                labeler_list = g_all_date_labeler_dict[g_all_date_list[k]];
                for (var n=0;n<labeler_list.length;n++)
                {
                    $('#'+g_all_date_list[k]+'-labeler-list').append('<li><a class="labeler_name" title="" style="width: 80px;">'+labeler_list[n]+'</a></li>')
                }
            }

            // 建立三级目录
            $('.date-name').blur().on('click', function (e) {
            e.preventDefault();
            g_current_date = $(this).text();

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
            get_total_cost();
        });

            // 响应任务名
            $('.task_name').blur().on('click',function () {
                g_task_name = $(this).text();
                get_task_info(g_current_date+"-"+g_task_name);
                $('.task_name').each(function () {
                    $(this).css("color","");
                });
                $(this).css("color","red");
            });

            // 响应标注人
            $('.labeler_name').blur().on('click', function () {
                g_labeler_name = $(this).text();
                get_labeler_info();
                $('.labeler_name').each(function () {
                    $(this).css("color","");
                });
                $(this).css("color","red");
            })

            },
        error:function(data){
            console.log(data);
            alert(data.responseJSON["msg"]);
        }
    });
}

// 添加月份
function add_date(){
    var key = $('#add_date').val();
    if(key !== "")
    {
        g_all_date_list.push(key);
        $.unique(g_all_date_list);
        update_date_list();
    }
}

// 添加任务
function add_task(){
    var key = "";
    $(".add_task").each(function () {
        key = $(this).val();
        if(key !== "")
        {
            if(!g_all_date_task_dict.hasOwnProperty(g_current_date))
            {
                g_all_date_task_dict[g_current_date] = []
            }
            g_all_date_task_dict[g_current_date].push(key);
            $('#'+g_current_date+'-task-list').find(".add_task").remove();
            $('#'+g_current_date+'-task-list').append('<li><a class="task_name" title="" style="width: 200px;">'+key+'</a></li>');
            $('#'+g_current_date+'-task-list').append('<li><a><input class="add_task" type="text" onkeydown="if(event.keyCode==13){add_task();return false}" style="background: white;padding-bottom: 0px;padding-top: 0px;margin-bottom: 0px;border-bottom-width: 0px;height: 30px;"></a></li>');
            // 响应任务名
            $('.task_name').blur().on('click',function () {
                g_task_name = $(this).text();
                get_task_info(g_current_date+"-"+g_task_name);
            });
        }
    })
}

// 获取对应的任务信息
function get_task_info(task_name) {
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
    // 获取该任务的指标进行指定
    var dataurl='/get_task_target/';
    var data=JSON.stringify({
        task_name: task_name, //任务
    });
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var json_data = JSON.parse(data);
            var target = json_data["target"];//获取该任务的指标
            show_target_info(target);
            },
        error:function(data){
            console.log(data);
            top.location.reload()
        }
    });
}

// 展示指标编辑页面
function show_target_info(target) {
    var table_html = "<tr><th>"+g_current_date+"-"+g_task_name+"</th>" +
        "<th><a id='copy_task'>复制该任务</a></th></tr>" +
        "<tr><th style='margin: 0px; padding: 0px'>指标</th><th style='margin: 0px; padding: 0px'>单价</th><th style='margin: 0px; padding: 0px'>操作</th></tr>";
    $.each(target,function (key,val) {
        if (key.indexOf("每小时任务标注量")>-1||key.indexOf("任务总数")>-1)
        {
            table_html += "<tr>" +
            "<th><input class='target_key' type='text' style='color: red' value='"+ key +"'></th>" +
            "<td><input class='target_val' type='text' value='"+ val +"'></td>" +
            "<td><a class='del_target' id="+ key+">删除</a></td>" +
            "</tr>"
        }
        else
            table_html += "<tr>" +
                "<td><input class='target_key' type='text' value='"+ key +"'></td>>" +
                "<td><input class='target_val' type='text' value='"+ val +"'></td>" +
                "<td><a class='del_target' id="+ key+">删除</a></td>" +
                "</tr>"
    });
    $("#table-container").html("<table id='show-table' class='table-hover'></table>");

    $("#show-table").html(table_html);

    $("#target-option").html("<span><a id='add_target' style='margin-right: 100px;'>新增指标</a></span><span><a id='save_target'>保存修改</a></span>");

    $(".del_target").blur().on("click",function () {
        var id = $(this).attr("id");
        delete target[id];
        show_target_info(target)
    });

    $("#save_target").blur().on("click",function () {
        if(g_task_name !== "")
            update_target(g_current_date+"-"+g_task_name)
    });

    $("#add_target").blur().on("click",function () {
        // 只允许同时存在一个指标输入
        if(g_task_name === "")
            return;
        var add_target_html = "<tr id='target_input'>" +
            "<td><input class='target_key' type='text' placeholder='输入指标名称'></td>" +
            "<td><input class='target_val' type='number' placeholder='输入单价，默认0' value='0'></td>" +
            "</tr>";

        $("#show-table").append(add_target_html);
    });

    $("#copy_task").blur().on("click",function () {
        g_copy_content["date"] = g_current_date;
        g_copy_content["task"] = g_task_name;
        console.log(g_copy_content);
    });
}

// 保存当前指标
function update_target(task_name) {
    var target = {};
    var target_vals = $('.target_val');
    $('.target_key').each(function(i,target_key) {
        if($(this).val() !== "")
            target[$(this).val()] = $(target_vals[i]).val();
    });
    var dataurl='/update_target/';
    var data=JSON.stringify({
        task_name: task_name, //任务
        target:target,
    });
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var data_json = JSON.parse(data);
            var msg = data_json["msg"];
            alert(msg);
            show_target_info(target);
            },
        error:function(data){
            console.log(data);
            top.location.reload()
        }
    });
}

// 获取标注人的信息
function get_labeler_info() {
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
    var dataurl='/get_labeler_info/';
    var data=JSON.stringify({
        current_date: g_current_date,
        labeler_name:g_labeler_name,
    });
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var data_json = JSON.parse(data);
            var task_labeler_info = data_json["task_labeler_info"];
            var all_task = data_json["all_task"];
            show_child_task_info(task_labeler_info, all_task);
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
            top.location.reload()
        }
    });
}

// 展示标注信息
function show_child_task_info(task_labeler_info, all_task) {
    var table_html, target = [],target_weight ,all_child_task_info;
    $("#table-container").html("<tr><th>"+g_labeler_name+"</th></tr>");
    for (var i = 0;i<all_task.length;i++)
    {
        $("#table-container").append("<table class='table-hover labeler-task' id='"+all_task[i]+"'></table>");
        target.length = 0;
        table_html = "<tr><th>"+all_task[i]+"</th></tr>";
        target_weight = task_labeler_info[all_task[i]+"_target"];
        for (var key in target_weight)
        {
            target.push(key);
        }
        table_html += "<tr>";
        for(var t = 0;t<target.length;t++)
        {
            if (target[t].indexOf("任务总数")>-1 || target[t].indexOf("每小时任务标注量")>-1)
                continue;
            if(target_weight[target[t]]>0)
                table_html+="<th style='margin: 0px; padding: 0px' class='title'>"+target[t]+"/"+target_weight[target[t]]+"元</th>";
            else
                table_html+="<th style='margin: 0px; padding: 0px' class='title'>"+target[t]+"</th>";
        }
        table_html += "</tr>";
        all_child_task_info = task_labeler_info[all_task[i]];
        for(var j=0;j<all_child_task_info.length;j++)
        {
            table_html += "<tr class='child-task-content'>";
            $.each(target,function (k,key) {
                if (key.indexOf("任务总数") < 0 && key.indexOf("每小时任务标注量")<0)
                    table_html += "<td style='margin: 0px; padding: 0px'><input class='target_val' type='text' value='"+ all_child_task_info[j][key] +"'></td>"
            });
        }
        table_html += "<tr>";
        if (target_weight.hasOwnProperty("任务总数"))
            table_html += "<th>任务总数:"+target_weight["任务总数"]+"</th>";
        if (target_weight.hasOwnProperty("每小时任务标注量"))
            table_html += "<th>每小时任务标注量:"+target_weight["每小时任务标注量"]+"</th>";
        table_html += "</tr>";
        $("#"+all_task[i]+"").html(table_html)
    }

    $("#target-option").html("<span><a id='save-edit'>保存修改</a></span>");

    $("#save-edit").on("click",function () {
        save_child_task_info()
    })
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
    });//发送cookie，验证登录
    var labeler_task_info = {};
    var task_name,target = [];
    var tempt = {};
    $(".labeler-task").each(function () {
        task_name = $(this).attr("id");
        labeler_task_info[task_name] = [];
        // 获取指标
        target.length = 0;
        $(this).find(".title").each(function (i,th) {
            target.push($(th).text())
        });
        // 每一个child-task-content是一个子任务
        $(this).find(".child-task-content").each(function (i,tr) {
            tempt = {};
            $(tr).find(".target_val").each(function (j,td) {
                tempt[target[j]] = $(td).val()
            });
            labeler_task_info[task_name].push(tempt);
        });
    });
    console.log(labeler_task_info);
    var dataurl = '/save_labeler_info/';
    // 获取页面上的信息
    var data=JSON.stringify({
        labeler_name: g_labeler_name,
        labeler_task_info: labeler_task_info
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
        }
    });
}

// 获取总费用信息
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
    var dataurl='/admin_get_total_cost/';
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
            var total_cost_info = data_json["total_cost_info"];
            var table_html = "";
            $.each(total_cost_info,function (key,val) {
                table_html+="<tr><th>"+key+"</th><th>"+g_current_date+"总费用</th><th>"+val+"</th></tr>"
            });
            table_html+="<tr><th><a id='paste_task'>粘贴任务</a></th></tr>";
            $("#table-container").html(table_html);
            $("#target-option").html("");

            $("#paste_task").blur().on("click",function () {
                if(g_copy_content !== {})
                {
                    paste_new_task();
                }
            })
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
        }
    });
}

// 粘贴复制的任务
function paste_new_task() {
    var dataurl = '/paste_new_task/';
    // 获取页面上的信息
    var data=JSON.stringify({
        copy_content: g_copy_content,
        dst_date: g_current_date,
    });
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var data_json = JSON.parse(data);
            var msg = data_json["msg"];
            alert(msg);
            update_date_list();
            },
        error:function(data){
            console.log(data);
        }
    });
}
