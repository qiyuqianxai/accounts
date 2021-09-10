
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
    get_all_account_data();
    $("#add_account").blur().on("click",function () {
        var user_type = "";
        layer.confirm('请选择新增用户类型？', {
            btn: ['普通用户','管理员用户','取消'] //按钮
        }, function(){
            user_type = "normal";
            add_account(user_type);
            layer.msg('新增用户成功', {icon: 1});
        },
        function(){
        user_type = "admin";
        add_account(user_type);
        layer.msg('新增用户成功', {icon: 1});
    },function () {
        });
    })
});

function get_all_account_data() {
    var dataurl='/oa/get_all_account_data/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
            var json_data = JSON.parse(data);
            g_all_account_data = json_data["all_account_data"];
            load_page_content(g_all_account_data.length);
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
            // top.location.reload()
        }
    });
}

function show_table_content(currpage,limit) {
    var show_account_data = g_all_account_data.slice((currpage-1)*limit,currpage*limit);
    // console.log((currpage-1)*limit,currpage*limit,show_account_data);
    var html_str = "";
    $.each(show_account_data,function (i,info) {
        html_str += "<tr id='"+info["用户名"]+"_info'>" +
            "<td>"+info["用户名"]+"</td>" +
            "<td class='col-blue' id='"+info["用户名"]+"_auth'>"+info["权限"]+"</td>" +
            "<td>"+info["姓名"]+"</td>" +
            "<td>"+info["密码"]+"</td>" +
            "<td>"+info["注册时间"]+"</td>" +
            "<td class='col-green' id='"+info["用户名"]+"_status'>"+info["状态"]+"</td>" +
            "<td>" +
            "<div class='layui-table-cell laytable-cell-1-0-10'>" +
            "<a class='layui-btn layui-btn-normal layui-btn-xs submit_start' id='"+info["用户名"]+"_start'>启用</a>" +
            "<a class='layui-btn layui-btn-warm layui-btn-xs submit_stop' id='"+info["用户名"]+"_stop'>停用</a>" +
            "<a class='layui-btn layui-btn-danger layui-btn-xs submit_del' id='"+info["用户名"]+"_del'>删除</a>" +
            "<a class='layui-btn layui-btn-normal layui-btn-xs submit_auth' id='"+info["用户名"]+"_cauth'>更改权限</a>" +
            "</div>" +
            "</td>" +
            "</tr>"
    });
    $("#table_content").html(html_str);
    //判断弹框
    var opt = "";
    $(".submit_stop").blur().on("click",function () {
        var id_name = $(this).attr("id");
        layer.confirm('确定停用该账号？', {
           btn: ['是','否'] //按钮
        }, function(){
            id_name = id_name.replace("_stop","_status");
            $("#"+id_name+"").html("停用");
            opt = "stop";
            edit_account(opt,id_name.replace("_status",""));
            layer.msg('已停用', {icon: 1});
        }, function(){
        });
    });
    $(".submit_start").blur().on("click",function () {
        var id_name = $(this).attr("id");
        layer.confirm('确定启用该账号？', {
           btn: ['是','否'] //按钮
        }, function(){
            id_name = id_name.replace("_start","_status");
            $("#"+id_name+"").html("正常");
            opt = "start";
            edit_account(opt,id_name.replace("_status",""));
            layer.msg('已启用', {icon: 1});
        }, function(){
        });
    });
    $(".submit_del").blur().on("click",function () {
        var id_name = $(this).attr("id");
        layer.confirm('确定删除该账号？', {
          btn: ['是','否'] //按钮
        }, function(){
            id_name = id_name.replace("_del","_info");
            $("#"+id_name+"").remove();
            opt = "del";
            edit_account(opt,id_name.replace("_info",""));
            layer.msg('已删除', {icon: 1});
        }, function(){
        });
    });
    $(".submit_auth").blur().on("click",function () {
        var id_name = $(this).attr("id");
        layer.confirm('确定更改该用户权限？', {
           btn: ['是','否'] //按钮
        }, function(){
            id_name = id_name.replace("_cauth","");
            if ($("#"+id_name+"_auth").text() === "normal")
            {
                $("#"+id_name+"_auth").html("admin");
            }
            else
                $("#"+id_name+"_auth").html("normal");
            opt = "change_auth";
            edit_account(opt,id_name);
            // get_all_account_data();
            layer.msg('已更改', {icon: 1});
        }, function(){
        });
    });
}

function load_page_content(info_num) {
    var element = layui.element;
    	layui.use(['laypage', 'layer'], function(){
		  var laypage = layui.laypage
		  ,layer = layui.layer;
		  //页码完整功能
		  laypage.render({
		    elem: 'page'
		    ,count: info_num
		    ,layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
		    ,jump: function(obj){
		        // console.log(obj["curr"],obj["limit"]);
		        show_table_content(parseInt(obj["curr"]),parseInt(obj["limit"]))
		    }
		  });
		});
}

function add_account(user_type) {
    var dataurl='/oa/add_account/'+user_type+'/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
            // alert("用户新增成功！");
            get_all_account_data()
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
            // top.location.reload()
        }
    });
}

function edit_account(opt,user) {
    var dataurl='/oa/edit_account/'+opt+'/'+user+'/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
            // alert("用户新增成功！");
            // get_all_account_data()
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
            // top.location.reload()
        }
    });
}