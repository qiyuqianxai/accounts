// 自定义搜索js代码

function get_search_key() {

    var key = $('#test_search').val();
    if(key !== "")
    {
        console.log(key);
        get_data(key,"本地搜索");//默认使用本地
    }
}

function get_data(key_word,search_range) {
    var dataurl='/get_search_result/';
    var data=JSON.stringify({
        key_word:key_word,
        search_range:search_range //要获取的资讯数据库名称
    });
    $.ajax({
        url:dataurl,
        contentType: "application/json; charset=utf-8",
        data:data,
        type:"POST",
        success:function(data){
            var json_data=JSON.parse(data);
            var all_data = json_data['search_result'];
            console.log('数据获取成功！');
            // 显示数据
            show_search_info(all_data);
        },
        error:function(data){
            console.log("get Info is wrong");
            console.log(data);
            alert("获取数据出错，请登陆，或联系管理员!");
            top.location.reload()
        }
    });
}

function show_search_info(all_data) {
    $('#main-container').html("");
    if(all_data.length < 1)
    {
        $('#main-container').html('<h3>抱歉，暂无该类资讯！</h3>')
    }
    else {
        $('#main-container').append('<ul id="info_length">您好！共为您找到'+all_data.length+'篇最新相关资讯</ul>');
        if(g_current_db == "注册项目动态")
        {
            var ohref = "http://star.sse.com.cn/star/renewal/";
            $('#main-container').append('<table class="table" id="info_table"><tbody id="table_content"><tr><th>发行人全称</th><th>审核状态</th><th>注册地</th><th>证监会行业</th><th>保荐机构</th><th>律师事务所</th><th>会计师事务所</th><th><a href='+ohref+'>更新日期<i class="fe fe-arrow-down"></i></a></th><th><a href='+ohref+'>受理日期</a></th></tr></tbody></table>');
            var pub_unit,status,register_place,SSC,sponsor,lawyer,accounting,last_time,accept_time;
            for(var j=0;j<all_data.length;j++)
            {
                pub_unit = all_data[j]["pub_unit"];
                status = all_data[j]["status"];
                register_place = all_data[j]["register_place"];
                SSC = all_data[j]["SSC"];
                sponsor = all_data[j]["sponsor"];
                lawyer = all_data[j]["lawyer"];
                accounting = all_data[j]["accounting"];
                last_time = all_data[j]["last_time"];
                accept_time = all_data[j]["accept_time"];
                $('#table_content').append('<tr><td class="align_left"><div class="chart-9"><a href='+ohref+' target="_blank">'+pub_unit+'</a></div></td><td class="align_left"><div class="chart-4">'+status+'</div></td><td>'+register_place+'</td><td class="align_left"><div class="chart-7">'+SSC+'</div></td><td class="align_left"><div class="chart-6"><a href='+ohref+' target="_blank">'+sponsor+'</a></div></td><td class="align_left"><div class="chart-7"><a href='+ohref+' target="_blank">'+lawyer+'</a></div></td><td class="align_left"><div class="chart-10"><a href='+ohref+' target="_blank">'+accounting+'</a></div></td><td class="nowrap">'+last_time+'</td><td class="nowrap">'+accept_time+'</td></tr>')
            }
        }
        else {
            var title,pub_time,content,href,source;
            for(var i=0;i<all_data.length;i++)
            {
                title = all_data[i]["title"];
                pub_time = all_data[i]["pub_time"];
                content = all_data[i]["content"];
                href = all_data[i]["href"];
                source = all_data[i]["source"];
                $('#main-container').append('<li class="info-box">' +
                    '<div class="date-source"><span class="date">'+pub_time+'&nbsp;&nbsp;&nbsp;</span><span class="source">'+source+'</span></div>' +
                    '<div class="article"><a class="title" href='+href+' target="_blank">'+title+'</a><a class="article" href='+href+' target="_blank"><p>'+content
                    +'</p></a></div>')
            }
        }

    }

}

