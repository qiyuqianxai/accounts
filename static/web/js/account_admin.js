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

//当前对外开发的日期
g_show_date = [];

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
            g_all_person_list = json_data["all_person_list"];
            g_show_date = json_data["show_date"];
            // 加载编辑任务单元
            $('#edit_date').html('<li><a><input id="add_date" type="text" onkeydown="if(event.keyCode==13){add_date();return false}" style="background: white;padding-bottom: 0px;padding-top: 0px;margin-bottom: 0px;border-bottom-width: 0px;height: 30px;"></a></li><li class="header__nav" id="date_date_list"></li>');
            var task_list;
            for(var i=0;i<g_all_date_list.length;i++)
            {
                $('#date_date_list').append('<li class="has-children">\n' +
                    '                        <a href="#1" title="" class="edit-date-name date-name" style="width: 280px;">'+g_all_date_list[i]+'</a>' +
                    '                        <ul class="sub-menu" id="'+g_all_date_list[i]+'-task-list">\n' +
                    '                        </ul>' +
                    '                    </li>');
                task_list = g_all_date_task_dict[g_all_date_list[i]];
                for (var j=0;j<task_list.length;j++)
                {
                    $('#'+g_all_date_list[i]+'-task-list').append('<li><a class="edit-task-name task-name" title="" style="width: 280px;">'+task_list[j]+'</a></li>')
                }
                $('#'+g_all_date_list[i]+'-task-list').append('<li><a><input class="add_task" type="text" onkeydown="if(event.keyCode==13){add_task();return false}" style="background: white;padding-bottom: 0px;padding-top: 0px;margin-bottom: 0px;border-bottom-width: 0px;height: 30px;"></a></li>');

            }

            // 加载人员核对信息单元
            $('#labeler_info').html('<li class="header__nav" id="labeler_date_list"></li>');
            var labeler_list;
            for(var k=0;k<g_all_date_list.length;k++)
            {
                $('#labeler_date_list').append('<li class="has-children">' +
                    '                        <a href="#1" title="" class="check-date-name date-name" style="width: 280px">'+g_all_date_list[k]+'</a>' +
                    '                        <ul class="sub-menu" id="'+g_all_date_list[k]+'-labeler-list">' +
                    '                        </ul>' +
                    '                    </li>');
                labeler_list = g_all_date_labeler_dict[g_all_date_list[k]];
                for (var n=0;n<labeler_list.length;n++)
                {
                    $('#'+g_all_date_list[k]+'-labeler-list').append('<li><a class="labeler_name" title="" style="width: 80px;">'+labeler_list[n]+'</a></li>')
                }
            }

            // 加载任务月核对信息单元
            $('#task_info').html('</li><li class="header__nav" id="task-check_date_list"></li>');
            for(var i=0;i<g_all_date_list.length;i++)
            {
                $('#task-check_date_list').append('<li class="has-children">' +
                    '                        <a href="#1" title="" class="date-name" style="width: 280px;">'+g_all_date_list[i]+'</a>' +
                    '                        <ul class="sub-menu" id="'+g_all_date_list[i]+'-task-check-list">\n' +
                    '                        </ul>' +
                    '                    </li>');
                task_list = g_all_date_task_dict[g_all_date_list[i]];
                for (var j=0;j<task_list.length;j++)
                {
                    $('#'+g_all_date_list[i]+'-task-check-list').append('<li><a class="task-name task-check_name" title="" style="width: 280px;">'+task_list[j]+'</a></li>')
                }
            }

            // 加载任务统计信息单元
            $('#task_done_info').html('<li class="header__nav" id="task-done_date_list"></li>');
            for(var i=0;i<g_all_date_list.length;i++)
            {
                $('#task-done_date_list').append('<li class="has-children">\n' +
                    '                        <a href="#1" title="" class="static-date-name date-name" style="width: 280px;">'+g_all_date_list[i]+'</a>' +
                    '                        <ul class="sub-menu" id="'+g_all_date_list[i]+'-taskdone-list">\n' +
                    '                        </ul>' +
                    '                    </li>');
                task_list = g_all_date_task_dict[g_all_date_list[i]];
                for (var j=0;j<task_list.length;j++)
                {
                    $('#'+g_all_date_list[i]+'-taskdone-list').append('<li><a class="static-task-name task-name" title="" style="width: 280px;">'+task_list[j]+'</a></li>')
                }
            }

            // 加载人员信息统计日期列表
            for(var i=0;i<g_all_date_list.length;i++){
                $('#person_static_date_list').append('<li><a class="static-name static-person-date-name" title="" style="width: 280px;">'+g_all_date_list[i]+'</a></li>')
            }

            // 加载人员信息统计人员列表
            for(var i=0;i<g_all_person_list.length;i++)
            {
                $('#person_static_name_list').append('<li><a class="static-name static-person-people-name" title="" style="width: 280px;">'+g_all_person_list[i]+'</a></li>')
            }
            // 建立三级目录,响应日期
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
            });

            $('.edit-date-name').blur().on('click',function () {
                $("#month_task_info").html("");
                $("#month_base_info").html("");
                $("#select_area").html("");
                $("#target-option").html("");
                var html_str = "";
                if(g_show_date.indexOf(g_current_date)>-1)
                {
                    html_str = "<tr><th><a id='paste_task'>粘贴任务</a></th></tr>" +
                        "<tr><th><a id='date_show_swh'>关闭该月份显示</a></th></tr>"
                }
                else
                    html_str = "<tr><th><a id='paste_task'>粘贴任务</a></th></tr>" +
                        "<tr><th><a id='date_show_swh'>开启该月份显示</a></th></tr>";
                $("#table-container").html(html_str);
                $("#paste_task").blur().on("click",function () {
                    if(g_copy_content !== {})
                    {
                        paste_new_task();
                    }
                });
                $("#date_show_swh").blur().on("click",function () {
                   switch_date();
                })
            });

            $('.check-date-name').blur().on('click',function () {
                $("#month_task_info").html("");
                $("#month_base_info").html("");
                $("#target-option").html("");
                $("#select_area").html("");
                get_total_cost();
            });
            // 响应任务名
            $('.task-name').blur().on('click',function () {
                $('.task-name').each(function () {
                    $(this).css("color","");
                });
                $(this).css("color","red");
            });

            $('.static-name').blur().on('click',function () {
                $('.static-name').each(function () {
                    $(this).css("color","");
                });
                $(this).css("color","red");
            });

            $('.edit-task-name').blur().on('click',function () {
                g_task_name = $(this).text();
                get_task_info(g_current_date+"-"+g_task_name);
            });

            // 响应标注人
            $('.labeler_name').blur().on('click', function () {
                g_labeler_name = $(this).text();
                get_labeler_info();
                $('.labeler_name').each(function () {
                    $(this).css("color","");
                });
                $(this).css("color","red");
            });

            // 响应核对模块的任务点击
            $('.task-check_name').blur().on('click',function () {
                g_task_name = $(this).text();
                get_task_chcek_info(g_current_date+"-"+g_task_name);
                $('.task-check_name').each(function () {
                    $(this).css("color","");
                });
                $(this).css("color","red");
            });
            
            // 获取绘制图表所需的一些信息
            get_all_date_task_info();
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
            $('#'+g_current_date+'-task-list').append('<li><a class="task_name" title="" style="width: 280px;">'+key+'</a></li>');
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
        "<th><a id='copy_task'>复制该任务</a></th><th><a id='delete_task'>删除该任务</a></th></tr>" +
        "<tr><th style='margin: 0px; padding: 0px'>指标</th><th style='margin: 0px; padding: 0px'>单价</th><th style='margin: 0px; padding: 0px'>操作</th></tr>";
    $.each(target,function (key,val) {
        if (key.indexOf("每小时任务标注量")>-1||key.indexOf("任务总数")>-1 ||key.indexOf("任务总张数")>-1 ||key.indexOf("任务总框数")>-1)
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
    
    $("#delete_task").blur().on("click",function () {
        var dataurl="/delete_task/"+g_current_date+"-"+g_task_name+"/";
        $.ajax({
            url:dataurl,
            contentType: "application/json; charset=utf-8",
            type:"GET",
            success:function(data){
                alert("数据库删除成功");
                top.location.reload()
                },
            error:function(data){
                alert("删除失败");
                top.location.reload()
            }
        });
    })
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
    $("#table-container").html("<tr><th><a href='/personal_info/"+g_labeler_name+"/' target='_blank' style='color: red'>"+g_labeler_name+"</a></th></tr>");
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
            if (target[t].indexOf("任务总数")>-1 || target[t].indexOf("每小时任务标注量")>-1 || target[t].indexOf("任务总张数")>-1 || target[t].indexOf("任务总框数")>-1)
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
                if (key.indexOf("任务总数") < 0 && key.indexOf("每小时任务标注量")<0 && key.indexOf("任务总张数") < 0 && key.indexOf("任务总框数") < 0)
                    table_html += "<td style='margin: 0px; padding: 0px'><input class='target_val' type='text' value='"+ all_child_task_info[j][key] +"'></td>"
            });
        }
        table_html += "<tr>";
        if (target_weight.hasOwnProperty("任务总数"))
            table_html += "<th>任务总数:"+target_weight["任务总数"]+"</th>";
        if (target_weight.hasOwnProperty("任务总张数"))
            table_html += "<th>任务总张数:"+target_weight["任务总张数"]+"</th>";
        if (target_weight.hasOwnProperty("任务总框数"))
            table_html += "<th>任务总框数:"+target_weight["任务总框数"]+"</th>";
        if (target_weight.hasOwnProperty("每小时任务标注量"))
            table_html += "<th>每小时任务标注量:"+target_weight["每小时任务标注量"]+"</th>";
        table_html += "</tr>";
        $("#"+all_task[i]+"").html(table_html)
    }

    $("#target-option").html("<span><a id='save-edit'>保存修改</a></span>");

    $("#save-edit").blur().on("click",function () {
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
            var table_html = "<tr><th><a href='/download_payroll/"+g_current_date+"/' target='_blank'>下载本月工资表</a></th></tr>";
            $.each(total_cost_info,function (key,val) {
                table_html+="<tr><th><a href='/personal_info/"+key+"/' target='_blank'>"+key+"</a></th><th>"+g_current_date+"工资</th><th>"+val+"</th></tr>"
            });
            $("#table-container").html(table_html);
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

// 获取绘制图表所需的信息
function get_all_date_task_info() {
    var dataurl='/static_task/get_date_task_info/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data) {
            var json_data = JSON.parse(data);
            g_all_date_task_info = json_data["all_date_task_info"];
            g_person_total_info_sorted = json_data["person_total_info_sorted"];
            g_person_total_info = json_data["person_total_info"];

            $(".static-date-name").blur().on("click",function () {
                g_current_date = $(this).text();
                get_month_static_info();
            });

            $("#person_static_total_info").blur().on("click",function () {
                get_all_person_info();
            });

            $(".static-person-people-name").blur().on("click",function () {
                g_labeler_name = $(this).text();
                get_static_people_info();
            });
            
            $(".static-person-date-name").blur().on("click",function () {
                g_current_date = $(this).text();
                get_static_person_month_info();
            });

            $('#summerize_info').blur().on("click",function () {
                get_all_date_static_info()
            })

        },
        error:function(data){
            alert("error");
        }
    });
}

// 获取一个月的统计情况
function get_month_static_info() {
    var dataurl='/static_task/get_date_info/'+g_current_date+'/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
                var json_data = JSON.parse(data);
                g_date_task_info = json_data["date_task_info"];
                g_month_person_info_sorted = json_data["month_person_info_sorted"];
                g_person_cost_ef = json_data["person_cost_ef"];
                $("#select_area").html("");
                $("#table-container").html("");
                $("#target-option").html("");
                $("#month_base_info").html(
                    "<div>"+g_current_date+"所用时长："+g_all_date_task_info[g_current_date]["月工作时长"]+"小时</div>" +
                    "<div>"+g_current_date+"所用费用："+g_all_date_task_info[g_current_date]["月总支出"]+"元</div>" +
                    "<div>"+g_current_date+"所用人数："+g_all_date_task_info[g_current_date]["月工作人数"]+"人</div>"+
                    "<div>"+g_current_date+"所完成任务数："+g_all_date_task_info[g_current_date]["月完成任务数"]+"</div>"+
                    "<div>"+g_current_date+"成本时效："+g_all_date_task_info[g_current_date]["月总支出"]/g_all_date_task_info[g_current_date]["月工作时长"]+"元/时</div>"+
                    "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;'>请选择统计指标</div>" +
                    "<select class='form-control' id='task_spread' style='font-size: large;'>" +
                    "   <option value=''>任务所用时间</option>" +
                    "   <option value=''>任务所用人数</option>" +
                    "   <option value=''>任务所用费用</option>" +
                     "  <option value=''>任务数据量</option>" +
                    "</select></div>"
                );
                var temp = [];
                $.each(g_date_task_info,function (task_name,info) {
                    temp.push([task_name,info["任务所用时间"]])
                });
                 draw_pie_chart(temp,"任务所用时间");
                $('#task_spread').on('change', function(e){
                    if (e.originalEvent) {
                        var target = $("#task_spread").find("option:selected").text();
                        var task_data = [];
                        $.each(g_date_task_info,function (task_name,info) {
                            task_data.push([task_name,info[target]])
                        });
                        console.log(task_data);
                        draw_pie_chart(task_data,target);
                    }
                });

                // 响应某月某任务统计情况
                $('.static-task-name').blur().on('click',function () {
                    g_task_name = $(this).text();
                    get_task_static_info();
                });
            },
        error:function(data){
            alert("error");
        }
    });
}

function draw_pie_chart(task_data,target) {
    var chart = {
       plotBackgroundColor: null,
       plotBorderWidth: null,
       plotShadow: false
   };
   var title = {
      text: g_current_date+target+"分布"
   };
   var tooltip = {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
   };
   var plotOptions = {
      pie: {
         allowPointSelect: true,
         cursor: 'pointer',
         dataLabels: {
            enabled: true,
            format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
            style: {
               color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
         }
      }
   };
   var series= [{
      type: 'pie',
      name: target+"占比",
      data: task_data,

   }];

   var json = {};
   json.chart = chart;
   json.title = title;
   json.tooltip = tooltip;
   json.series = series;
   json.plotOptions = plotOptions;
   $('#month_task_info').highcharts(json);
}

// 获取某月单个任务的统计情况
function get_task_static_info() {
    $("#select_area").html("");
    $("#table-container").html("");
    $("#target-option").html("");
    $("#month_task_info").html("");
    $("#month_base_info").html(
        "<div>"+g_task_name+" 总人时："+g_date_task_info[g_task_name]["任务所用时间"]+"小时</div>" +
        "<div>"+g_task_name+" 预估任务数量时效："+g_date_task_info[g_task_name]["预估任务数量时效"]+"标注量/时</div>" +
        "<div>"+g_task_name+" 实际任务数量时效："+g_date_task_info[g_task_name]["任务数据量"]/g_date_task_info[g_task_name]["任务所用时间"]+"标注量/时</div>"+
        "<div>"+g_task_name+" 实际任务成本时效："+g_date_task_info[g_task_name]["任务所用费用"]/g_date_task_info[g_task_name]["任务所用时间"]+"元/时</div>"+
        "<div>"+g_task_name+" 实际工作人数："+g_date_task_info[g_task_name]["任务所用人数"]+"人</div>"+
        "<div>"+g_task_name+" 成本时效的人员排序：</div>"
    );
    $.each(g_person_cost_ef[g_task_name],function (i,info) {
        $("#month_base_info").append("<div style='text-align: center'>"+(i+1)+"  <a href='/personal_info/"+info[0]+"/' target='_blank'>"+info[0]+"</a>  "+info[1]+"元/时</div>")
    })

}

// 获取整体人员信息
function get_all_person_info() {
    $("#select_area").html("");
    $("#table-container").html("");
    $("#target-option").html("");
    $("#month_task_info").html("");
    $("#month_base_info").html(
        "<div>当前总工作人数："+g_all_person_list.length+"</div>" +
        "<div>当月入职人数/当月离职人数：0/0</div>" +
        "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;'>请选择统计指标</div>" +
        "<select class='form-control' id='all_info_static_target' style='font-size: large;'>" +
        "  <option value=''>总收入</option>" +
        "  <option value=''>总工作时长</option>" +
        "  <option value=''>总工作天数</option>" +
        "  <option value=''>总任务数</option>" +
        "  <option value=''>总时效</option>" +
        "</select></div>"
    );
    $.each(g_person_total_info_sorted["总收入"],function (i,info) {
                $("#month_task_info").append("<div style='text-align: center'>"+(i+1)+" <a href='/personal_info/"+info[0]+"/' target='_blank'>"+info[0]+"</a>  "+info[1]+"</div>");
    });
    $('#all_info_static_target').on('change', function(e){
        if (e.originalEvent) {
            var target = $("#all_info_static_target").find("option:selected").text();
            $("#month_task_info").html("");
            $.each(g_person_total_info_sorted[target],function (i,info) {
                $("#month_task_info").append("<div style='text-align: center'>"+(i+1)+" <a href='/personal_info/"+info[0]+"/' target='_blank'>"+info[0]+"</a>  "+info[1]+"</div>");
            })
        }
    });

}

// 获取人员列表中多点击人员的信息
function get_static_people_info() {
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
    var dataurl='/personal_date_list/'+g_labeler_name+"/";
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data) {
            var json_data = JSON.parse(data);
            g_person_all_date_info = json_data["all_date_info"];
            $("#table-container").html("");
            $("#target-option").html("");
            $("#select_area").html("");
            $("#month_task_info").html("");
            $("#month_base_info").html(
                "<div>姓名："+g_labeler_name+"</div>" +
                "<div>工龄：0</div>" +
                "<div>职级：0</div>" +
                "<div>总收入："+g_person_total_info[g_labeler_name]["总收入"]+"元</div>" +
                "<div>总工作时长："+g_person_total_info[g_labeler_name]["总工作时长"]+"时</div>" +
                "<div>总任务数："+g_person_total_info[g_labeler_name]["总任务数"]+"</div>" +
                "<div>总平均收入时效："+g_person_total_info[g_labeler_name]["总收入"]/g_person_total_info[g_labeler_name]["总工作时长"]+"元/时</div>"+
                "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;'>请选择统计指标1(左)</div>" +
                "<select class='form-control' id='y_tar_list_1' style='font-size: large;float: left'>" +
                "   <option value=''>工资</option>" +
                "   <option value=''>工时</option>" +
                "   <option value=''>完成任务数</option>" +
                "   <option value=''>工作天数</option>" +
                "   <option value=''>日平均工作时长</option>" +
                "   <option value=''>平均收入时效</option>" +
                "</select></div>" +
                "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;margin-left: 20px;'>请选择统计指标2(右)</div>" +
                "<select class='form-control' id='y_tar_list_2' style='font-size: large;'>" +
                "<option value=''>无</option>" +
                "<option value=''>工资</option>" +
                "<option value=''>工时</option>" +
                "<option value=''>完成任务数</option>" +
                "<option value=''>工作天数</option>" +
                "<option value=''>日平均工作时长</option>" +
                "<option value=''>平均收入时效</option>" +
                "</select></div>"
            );

            $('#y_tar_list_1').on('change', function(e){
                if (e.originalEvent) {
                    var y_tar_1 = $("#y_tar_list_1").find("option:selected").text();
                    var y_tar_2 = $("#y_tar_list_2").find("option:selected").text();
                    draw_line_chart(y_tar_1,y_tar_2,g_person_all_date_info);
                }
            });
            $('#y_tar_list_2').on('change', function(e){
                if (e.originalEvent) {
                    var y_tar_1 = $("#y_tar_list_1").find("option:selected").text();
                    var y_tar_2 = $("#y_tar_list_2").find("option:selected").text();
                    draw_line_chart(y_tar_1,y_tar_2,g_person_all_date_info);
                }
            });
            draw_line_chart("工资", "无", g_person_all_date_info);
        },
        error:function(data){
            alert(data.responseJSON["msg"]);
        }
    });
}

// 获取日期列表中点击日期获得对应日期信息
function get_static_person_month_info() {
    $("#select_area").html("");
    $("#table-container").html("");
    $("#target-option").html("");
    $("#month_task_info").html("");
    $("#month_base_info").html(
        "<div>"+g_current_date+"人员平均工作时长："+g_all_date_task_info[g_current_date]["月工作时长"]/g_all_date_task_info[g_current_date]["月工作人数"]+"时/人</div>" +
        "<div>"+g_current_date+"人员平均收入："+g_all_date_task_info[g_current_date]["月总支出"]/g_all_date_task_info[g_current_date]["月工作人数"]+"元/人</div>" +
        "<div>"+g_current_date+"人员平均成本时效："+g_all_date_task_info[g_current_date]["月总支出"]/g_all_date_task_info[g_current_date]["月工作时长"]+"元/时</div>" +
        "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;'>请选择统计指标</div>" +
        "<select class='form-control' id='month_info_static_target' style='font-size: large;'>" +
        "  <option value=''>月收入</option>" +
        "  <option value=''>月工作时长</option>" +
        "  <option value=''>月工作天数</option>" +
        "  <option value=''>月完成任务数</option>" +
        "  <option value=''>月工作时效</option>" +
        "</select></div>"
    );

    var dataurl='/static_task/get_date_info/'+g_current_date+'/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
                var json_data = JSON.parse(data);
                g_month_person_info_sorted = json_data["month_person_info_sorted"];
                $.each(g_month_person_info_sorted["月收入"],function (i,info) {
                    $("#month_task_info").append("<div style='text-align: center'>"+(i+1)+" <a href='/personal_info/"+info[0]+"/' target='_blank'>"+info[0]+"</a>  "+info[1]+"</div>");
                });
                $('#month_info_static_target').on('change', function(e){
                    if (e.originalEvent) {
                        var target = $("#month_info_static_target").find("option:selected").text();
                        $("#month_task_info").html("");
                        $.each(g_month_person_info_sorted[target],function (i,info) {
                            $("#month_task_info").append("<div style='text-align: center'>"+(i+1)+" <a href='/personal_info/"+info[0]+"/' target='_blank'>"+info[0]+"</a>  "+info[1]+"</div>");
                        })
                    }
                });
            },
        error:function(data){
            alert("error");
        }
    });
}

function draw_line_chart(y_tar_1,y_tar_2,draw_info) {
    var x_data = [],y_data_1 = [],y_data_2 = [];
    $.each(draw_info,function (date,info) {
        x_data.push(date);
        if(info.hasOwnProperty(y_tar_1))
           y_data_1.push(info[y_tar_1]);
        if(info.hasOwnProperty(y_tar_2))
           y_data_2.push(info[y_tar_2]);
    });
    console.log(y_data_1,y_data_2);
    var title = {
      text: '近期工作总体统计情况'
   };

   var xAxis = {
      categories: x_data
   };
   var yAxis = [{
      title: {
         text: y_tar_1
      },
   },{
      title: {
         text: y_tar_2
      },
       opposite: true
   }];
   var plotOptions = {
      line: {
         dataLabels: {
            enabled: true
         },
         enableMouseTracking: false
      }
   };
   var series= [{
         name: y_tar_1,
         data: y_data_1,
      }, {
         name: y_tar_2,
         data: y_data_2,
         yAxis:1
      }
   ];

   var json = {};

   json.title = title;
   // json.subtitle = subtitle;
   json.xAxis = xAxis;
   json.yAxis = yAxis;
   json.series = series;
   json.plotOptions = plotOptions;
   $('#month_task_info').highcharts(json);
}

// 获取总体信息维度
function get_all_date_static_info() {
    $("#table-container").html("");
    $("#target-option").html("");
    $("#month_base_info").html("");
    $("#month_task_info").html("");
    $("#select_area").html("<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;'>请选择统计指标1(左)</div>" +
        "<select class='form-control' id='y_tar_list_1' style='font-size: large;float: left'>" +
        "   <option value=''>月完成任务数</option>" +
        "   <option value=''>月完成数据量</option>" +
        "   <option value=''>月总支出</option>" +
         "  <option value=''>月工作人数</option>" +
         "  <option value=''>月工作时长</option>" +
        "  <option value=''>月任务成本时效</option>" +
        "</select></div>" +
        "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;margin-left: 20px;'>请选择统计指标2(右)</div>" +
        "<select class='form-control' id='y_tar_list_2' style='font-size: large;'>" +
        "<option value=''>无</option>" +
        "<option value=''>月完成任务数</option>" +
        "<option value=''>月完成数据量</option>" +
        "<option value=''>月总支出</option>" +
        "<option value=''>月工作人数</option>" +
        "<option value=''>月工作时长</option>" +
        "<option value=''>月任务成本时效</option>" +
        "</select></div>");
    draw_line_chart("月完成任务数","无",g_all_date_task_info);

    $('#y_tar_list_1').on('change', function(e){
        if (e.originalEvent) {
            var y_tar_1 = $("#y_tar_list_1").find("option:selected").text();
            var y_tar_2 = $("#y_tar_list_2").find("option:selected").text();
            draw_line_chart(y_tar_1,y_tar_2,g_all_date_task_info);
        }
    });
    $('#y_tar_list_2').on('change', function(e){
        if (e.originalEvent) {
            var y_tar_1 = $("#y_tar_list_1").find("option:selected").text();
            var y_tar_2 = $("#y_tar_list_2").find("option:selected").text();
            draw_line_chart(y_tar_1,y_tar_2,g_all_date_task_info);
        }
    });
}

// 获取对应的任务信息
function get_task_chcek_info(task_name) {
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
    var dataurl='/get_task_done_target/';
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
            var all_labeler_info = json_data["all_labeler_info"];//获取该任务下所有标注人员信息
            // 展示任务对应的人员信息
            $("#select_area").html("");
            $("#table-container").html("<tr><th><a id='task_add_chi_task'>新增子任务</a></th></tr>");
            $("#target-option").html("");
            $("#month_task_info").html("");
            $("#month_base_info").html("");
            var target = [];
            $.each(all_labeler_info, function (labeler, info) {
                $("#table-container").append("<tr><th>"+labeler+"</th></tr>");
                for(var i = 0;i<info.length;i++)
                {
                    $("#table-container").append("<tr>");
                    $.each(info[i], function (key,val) {
                        $("#table-container").append("<th>"+key+"</th>");
                        if(target.indexOf(key) < 0)
                            target.push(key);
                    });
                    $("#table-container").append("</tr><tr>");
                    $.each(info[i], function (key,val) {
                        $("#table-container").append("<td>"+val+"</td>");
                    });
                    $("#table-container").append("</tr>");
                }
            });
            $("#task_add_chi_task").blur().on("click",function () {
                task_add_chi_task(target);
            })
            },
        error:function(data){
            console.log(data);
            top.location.reload()
        }
    });
}


// 开启关闭日期
function switch_date() {
    var dataurl='/admin/switch_date/'+g_current_date+'/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
            var orc_txt = $("#date_show_swh").text();
            if (orc_txt.startsWith("开启"))
            {
                $("#date_show_swh").html("关闭该月任务显示");
            }
            else
                $("#date_show_swh").html("开启该月任务显示");
            },
        error:function(data){
            console.log(data);
            top.location.reload()
        }
    });
}

function task_add_chi_task(target) {
    var html_str = "<div><tr><td><input class='add_chi_content' type='text' value='' placeholder='标注人'></td></tr>";
    for(var i=0;i<target.length-1;i++)
    {
        html_str += "<tr><td><input class='add_chi_content' type='text' value='' placeholder="+target[i]+"></td></tr>"
    }
    html_str += "</div>";

    layer.open({
        //formType: 2,//这里依然指定类型是多行文本框，但是在下面content中也可绑定多行文本框
        title: '新增该任务的子任务',
        area: ['300px', '600px'],
        btnAlign: 'c',
        closeBtn:'1',//右上角的关闭
        content: html_str,
        btn:['确认','取消','关闭'],
        yes: function (index, layero) {
            var task_add_data = {};
            $(".add_chi_content").each(function () {
                task_add_data[$(this).attr("placeholder")]=$(this).val()
            });
            console.log(task_add_data);
            var dataurl='/task_add_chi_task/';
            var data=JSON.stringify(
                {
                    "dict":task_add_data,
                    "task":g_task_name,
                    "date":g_current_date
                });
            $.ajax({
                url:dataurl,
                contentType: "application/json; charset=utf-8",
                data:data,
                type:"POST",
                success:function(data){
                    alert("更新成功！");
                    get_task_chcek_info(g_current_date+"-"+g_task_name);
                    },
                error:function(data){
                    alert(data.responseJSON["msg"]);
                    // top.location.reload()
                }
            });
        layer.close(index);
        //可执行确定按钮事件并把备注信息（即多行文本框值）存入需要的地方
        },
        no:function(index)
        {
        // alert('您刚才点击了取消按钮');
        layer.close(index);
        return false;//点击按钮按钮不想让弹层关闭就返回false
        },
        close:function(index)
        {
        // alert('您刚才点击了关闭按钮');
        return false;//点击按钮按钮不想让弹层关闭就返回false
        }
        });
}