// 每月对应的费用、时间、人数、任务数
g_all_date_task_info = {};
// 当前月份
g_current_date = "";

// 该月任务情况
g_date_task_info = {};

g_ytar_identi = {
    "月完成任务数":"task_done_num",
    "月完成数据量":"task_data_count",
    "月花费金额(元)":"task_cost",
    "月工作人数":"task_person",
    "月工作时间(小时)":"task_time",
    "无": ""
};
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
    var dataurl='/static_task/get_date_task_info/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
            var json_data = JSON.parse(data);
            g_all_date_task_info = json_data["all_date_task_info"];
            // 加载月份
            $.each(g_all_date_task_info,function (date,date_info) {
                $('#date_list').append('<li class="task_date"><a href="#0" title="" class="date_name">'+date+'</a></li>');
            });
            // draw_line_chart(["task_done_num"]);

            get_all_date_static_info();
            draw_line_chart_2("月完成任务数","无");
            // 点击日期名时加载对应的信息
            $(".date_name").on("click",function () {
                g_current_date = $(this).text();
                get_date_static_info();
            });

             $('#home').on("click",function () {
                  get_all_date_static_info();
                  draw_line_chart_2("月完成任务数","无");
             });
             },
        error:function(data){
            alert(data.responseJSON["msg"]);
        }
    });
});

function get_all_date_static_info() {
    $("#month_base_info").html("");
    $("#month_task_info").html("");
    $("#month_person_info").css("height","0px");
    $("#month_person_info").html("");
    $("#select_area").html("<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;'>请选择统计指标1(左)</div>" +
        "<select class='form-control' id='y_tar_list_1' style='font-size: large;float: left'>" +
        "   <option value=''>月完成任务数</option>" +
        "   <option value=''>月完成数据量</option>" +
        "   <option value=''>月花费金额(元)</option>" +
         "  <option value=''>月工作人数</option>" +
         "  <option value=''>月工作时间(小时)</option>" +
        "</select></div>" +
        "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;margin-left: 20px;'>请选择统计指标2(右)</div>" +
        "<select class='form-control' id='y_tar_list_2' style='font-size: large;'>" +
        "<option value=''>无</option>" +
        "<option value=''>月完成任务数</option>" +
        "<option value=''>月完成数据量</option>" +
        "<option value=''>月花费金额(元)</option>" +
        "<option value=''>月工作人数</option>" +
        "<option value=''>月工作时间(小时)</option>" +
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

function get_date_static_info() {
    var dataurl='/static_task/get_date_info/'+g_current_date+'/';
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        type:"GET",
        success:function(data){
                var json_data = JSON.parse(data);
                g_date_task_info = json_data["date_task_info"];
                var date_person_info = json_data["date_person_info"];
                $("#select_area").html("");
                $("#month_base_info").html(
                    "<div>"+g_current_date+"所用时长："+g_all_date_task_info[g_current_date]["task_time"]+"小时</div>" +
                    "<div>"+g_current_date+"所用费用："+g_all_date_task_info[g_current_date]["task_cost"]+"元</div>" +
                    "<div>"+g_current_date+"所用人数："+g_all_date_task_info[g_current_date]["task_person"]+"</div>"+
                    "<div>"+g_current_date+"所完成任务数："+g_all_date_task_info[g_current_date]["task_done_num"]+"</div>"+
                    "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;'>请选择统计指标</div>" +
                    "<select class='form-control' id='task_spread' style='font-size: large;float: left'>" +
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
                // 标注人员信息统计
                draw_bar_chart(date_person_info);
            },
        error:function(data){
            alert(data.responseJSON["msg"]);
        }
    });
}

function draw_line_chart(y_tars) {
    $("#month_base_info").css({"width":(g_all_date_task_info.length*20).toString+'px',"height":"450px"});
    $("#select_area").html("<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;'>请选择统计指标1(左)</div>" +
        "<select class='form-control' id='y_tar_list_1' style='font-size: large;float: left'>" +
        "   <option value=''>月完成任务数</option>" +
        "   <option value=''>月完成数据量</option>" +
        "   <option value=''>月花费金额(元)</option>" +
         "  <option value=''>月工作人数</option>" +
         "  <option value=''>月工作时间(小时)</option>" +
        "</select></div>" +
        "<div><div style='float: left;font-size: large;padding-top: 17px;padding-right: 5px;margin-left: 20px;'>请选择统计指标2(右)</div>" +
        "<select class='form-control' id='y_tar_list_2' style='font-size: large;'>" +
        "<option value=''>无</option>" +
        "<option value=''>月完成任务数</option>" +
        "<option value=''>月完成数据量</option>" +
        "<option value=''>月花费金额(元)</option>" +
        "<option value=''>月工作人数</option>" +
        "<option value=''>月工作时间(小时)</option>" +
        "</select></div>");
    var points_1 = [];
    var points_2 = [];
    var x_num = 0;
    var ticks = [];
    $.each(g_all_date_task_info,function (date,info) {
        points_1.push([x_num, info[y_tars[0]]]);
        if(y_tars.length > 1)
            points_2.push([x_num, info[y_tars[1]]]);
        ticks.push([x_num,date]);
        x_num++;
    });
    var dataset = [
        {
            data: points_1,
            yaxis: 1,
            xaxis: 1,
            lines:{show:true,title:y_tars[0]},
            points: {
                radius: 3,
                show:true
            },
             color:"#FF7070"
        }
    ];
    if(points_2.length > 0)
        dataset.push(
            {
                data:points_2,
                yaxis: 2,
                xaxis:1,
                lines:{show:true},
                points: {
                radius: 3,
                show:true,
                },
                color:"#3366FF"
            });

    var options = {
    grid: {
            hoverable: true
    },
    xaxis:{
        show:true,
        ticks :ticks,
        position:"bottom"
    },
    yaxes: [{ position: "left" }, { position: "right"}]
    };
    $.plot($("#month_base_info"), dataset, options);

    var previousPoint = null;
    $("#month_base_info").bind("plothover", function (event, pos, item) {
        if (item) {
            if (previousPoint !== item.dataIndex) {
                previousPoint = item.dataIndex;
                $("#tooltip").remove();
                var y = item.datapoint[1].toFixed(0);
                showTooltip(item.pageX, item.pageY,y);
            }
        }
        else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
}

function showTooltip(x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css( {
        position: 'absolute',
        display: 'none',
        top: y + 10,
        left: x + 10,
        border: '1px solid #fdd',
        padding: '2px',
        'background-color': '#dfeffc',
        opacity: 0.80
    }).appendTo("body").fadeIn(200);
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

function draw_line_chart_2(y_tar_1,y_tar_2) {
    var x_data = [],y_data_1 = [],y_data_2 = [];
    $.each(g_all_date_task_info,function (date,info) {
        x_data.push(date);
        if(info.hasOwnProperty(g_ytar_identi[y_tar_1]))
           y_data_1.push(info[g_ytar_identi[y_tar_1]]);
        if(info.hasOwnProperty(g_ytar_identi[y_tar_2]))
           y_data_2.push(info[g_ytar_identi[y_tar_2]]);
    });
    console.log(y_data_1,y_data_2);
    var title = {
      text: x_data[0]+"-"+x_data[x_data.length-1]+'标注项目统计情况'
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
   $('#month_base_info').highcharts(json);
}

function draw_bar_chart(date_person_info) {
    $("#month_person_info").css("height","2000px");
    var x_data = [],y_data_1 = [],y_data_2 = [];
    $.each(date_person_info,function (person,info) {
       x_data.push(person);
       y_data_1.push(info["工资"]);
       y_data_2.push(info["工时"])
    });
    var chart = {
      type: 'bar'
   };
   var title = {
      text: g_current_date+'标注人员任务完成信息统计'
   };

   var xAxis = {
      categories: x_data,
      title: {
         text: "标注人员"
      },
       // tickWidth:00,
       tickPixelInterval:5,
       // tickInterval:20
   };
   var yAxis = [{
      min: 0,
      title: {
         text: '工资(元)',
         align: 'high'
      },
      labels: {
         overflow: 'justify'
      }
   },
   {
      min: 0,
      title: {
         text: '工时(小时)',
         align: 'high'
      },
      labels: {
         overflow: 'justify'
      },
      opposite: true
   }];
   var tooltip = {
      valueSuffix: ' '
   };
   var plotOptions = {
      bar: {
         dataLabels: {
            enabled: true
         }
      }
   };
   var legend = {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 100,
      floating: true,
      borderWidth: 2,
      backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
      shadow: true
   };
   var credits = {
      enabled: false
   };

   var series= [{
            name: '工资',
            data: y_data_1,
            pointWidth:5
        },
       {
            name: '工时',
            data: y_data_2,
            yAxis:1,
           pointWidth:5
        }
   ];

   var json = {};
   json.chart = chart;
   json.title = title;
   json.tooltip = tooltip;
   json.xAxis = xAxis;
   json.yAxis = yAxis;
   json.series = series;
   json.plotOptions = plotOptions;
   json.legend = legend;
   json.credits = credits;
   $('#month_person_info').highcharts(json);
}