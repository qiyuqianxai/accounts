g_limit_target = ["权限","注册时间","职级","状态"];
$(function () {
    get_person_data();
    $("#update_personal_data").blur().on("click",function () {
        update_person_data();
    })
});

function get_person_data() {
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
    var dataurl='/oa/get_person_data/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
            var json_data = JSON.parse(data);
            var personal_data = json_data["personal_data"];
            $("#current_user").html(personal_data["用户名"]);
            var table_html = "";
            $.each(personal_data,function (key,val) {
                if($.inArray(key,g_limit_target) > -1)
                    table_html+="<tr><th>"+key+"</th><td><input type='text' name='"+key+"' class='layui-input person_data_val' value='"+val+"' disabled="+true+"></td></tr>"
                else
                {
                    if(key === "用户名" || key === "密码")
                        table_html+="<tr><th>"+key+"</th><td><input type='text' name='"+key+"' class='layui-input person_data_val' value='"+val+"' required></td></tr>"
                    else
                        table_html+="<tr><th>"+key+"</th><td><input type='text' name='"+key+"' class='layui-input person_data_val' value='"+val+"'></td></tr>"
                }
            });
            $("#table").html(table_html);
            },
        error:function(data){
            alert("error");
            // top.location.reload()
        }
    });
}

function update_person_data() {
    var person_data_dict = {};
    var key = "",val = "";
    $(".person_data_val").each(function () {
        key = $(this).attr("name").toString();
        val = $(this).val();
        person_data_dict[key] = val
    });
    person_data_dict = JSON.stringify(person_data_dict);
    var url = "/oa/update_person_data/";
    $.ajax({
        url:url,
        contentType: "application/json; charset=utf-8",
        type:"POST",
        data:person_data_dict,
        success:function(data){
            var json_data = JSON.parse(data);
            var msg = json_data["msg"];
            if(msg)
            {
                alert(msg)
            }
            get_person_data();
            },
        error:function(data){
            alert("error");
            top.location.reload()
        }
    });
}