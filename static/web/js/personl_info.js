// 当前查看人员姓名
g_labeler_name = "";
// 当前月份
g_current_date = "";
// 当前标注人员每月统计信息
g_all_date_info = {};
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
    g_labeler_name = $("#mark_name").text().replace("姓名：","");
    var dataurl='/personal_date_list/'+g_labeler_name+"/";
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data) {
            var json_data = JSON.parse(data);
            g_person_all_date_info = json_data["all_date_info"];
            var personal_info = json_data["personal_info"];
            $("#select_area").html("");
            $("#month_task_info").html("");
            $("#month_base_info").html(
                "<div>姓名："+personal_info["姓名"]+"</div>" +
                "<div>工龄："+personal_info["工龄"]+"</div>" +
                "<div>职级："+personal_info["职级"]+"</div>" +
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
});

function get_task_info_with_date() {
    var dataurl='/get_task_info/'+g_mark_name+"/"+g_current_date+"/";
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
            var json_data = JSON.parse(data);
            var work_time = json_data["work_time"];
            var salary = json_data["salary"];
            $("#select_area").html("");
            $("#month_base_info").html("<div>"+g_current_date+"工作时长："+work_time+"小时</div>" +
                "<div>"+g_current_date+"工资："+salary+"元</div>");
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
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
      text: g_labeler_name +'近期工作统计情况'
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

function get_all_date_static_info() {
    $("#month_base_info").html("");
    $("#select_area").html("<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;'>请选择统计指标1(左)</div>" +
        "<select class='form-control' id='y_tar_list_1' style='font-size: large;float: left'>" +
        "   <option value=''>工资</option>" +
        "   <option value=''>工时</option>" +
        "   <option value=''>完成任务数</option>" +
        "</select></div>" +
        "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;margin-left: 20px;'>请选择统计指标2(右)</div>" +
        "<select class='form-control' id='y_tar_list_2' style='font-size: large;'>" +
        "<option value=''>无</option>" +
        "<option value=''>工资</option>" +
        "<option value=''>工时</option>" +
        "<option value=''>完成任务数</option>" +
        "</select></div>");

    $('#y_tar_list_1').on('change', function(e){
        if (e.originalEvent) {
            var y_tar_1 = $("#y_tar_list_1").find("option:selected").text();
            var y_tar_2 = $("#y_tar_list_2").find("option:selected").text();
            draw_line_chart_2(y_tar_1,y_tar_2);
        }
    });
    $('#y_tar_list_2').on('change', function(e){
        if (e.originalEvent) {
            var y_tar_1 = $("#y_tar_list_1").find("option:selected").text();
            var y_tar_2 = $("#y_tar_list_2").find("option:selected").text();
            draw_line_chart_2(y_tar_1,y_tar_2);
        }
    });
}